<?php

namespace App\Services;

use App\Http\Requests\User\StoreRequest;
use App\Models\Order;
use App\Models\RefreshToken;
use App\Models\User;
use App\Notifications\CustomVerifyEmail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthService
{
    public function register($data)
    {
        try {
            DB::beginTransaction();
            $credentials = ['email' => $data['email'], 'password' => $data['password']];
            $fingerprint = $data['fingerprint'];
            $data['password'] = Hash::make($data['password']);

            $user = User::firstOrCreate(['email' => $data['email']], $data);

            $user->notify(new CustomVerifyEmail());
            DB::commit();
            return response()->json(['message' => 'Please verify your email address.'], 201);
        }catch(Exception $e){
            DB::rollBack();
            return response($e->getMessage(), 500);
        }
    }


    public function login($credentials, $fingerprint)
    {
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

//        if (!auth()->user()->hasVerifiedEmail()) {
//            return response()->json(['error' => 'Email not verified'], 403);
//        }

        return $this->getResponseWithTokens($token, $fingerprint);
    }

    public function getResponseWithTokens($token, $fingerprint)
    {
        $this->invalidateRefreshToken($fingerprint);
        $refreshToken = $this->createRefreshToken($fingerprint);
        $cookie = cookie('refresh_token', $refreshToken, config('jwt.refresh_ttl'), null, null, true, true);
        $this->syncOrders();
        return $this->respondWithToken($token, $refreshToken)->withCookie($cookie);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout($fingerprint)
    {
        $this->invalidateRefreshToken($fingerprint);
        auth()->logout(true);

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh($refreshToken, $fingerprint)
    {
        $storedToken = RefreshToken::where('refresh_token', $refreshToken)
            ->where('fingerprint', $fingerprint)
            ->first();

        if (!$storedToken || $storedToken->expires_at < now()) {
            return response()->json(['error' => 'Invalid or expired refresh token'], 400);
        }

        try {
            $token = auth()->refresh();
            $newRefreshToken = $this->createRefreshToken($fingerprint);

            $storedToken->delete();

            $cookie = cookie('refresh_token', $newRefreshToken, config('jwt.refresh_ttl'), null, null, true, true);
            return $this->respondWithToken($token, $newRefreshToken)->withCookie($cookie);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not refresh token'], 500);
        }

    }

    protected function respondWithToken($token, $refreshToken)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }

    public static function createRefreshToken($fingerprint)
    {
        $userId = auth()->user()->id;
        $refreshToken = bin2hex(random_bytes(64));
        $expiresAt = now()->addMinutes(config('jwt.refresh_ttl'));

        RefreshToken::create([
            'user_id' => $userId,
            'refresh_token' => $refreshToken,
            'fingerprint' => $fingerprint,
            'expires_at' => $expiresAt,
        ]);

        return $refreshToken;
    }

    public static function invalidateRefreshToken($fingerprint)
    {
        $userId = auth()->user()->id;
        RefreshToken::where('user_id', $userId)
            ->where('fingerprint', $fingerprint)
            ->delete();
    }

    protected function syncOrders()
    {
        try {
            DB::beginTransaction();

            $guest_id = request()->cookie('guest_id');
            $guestOrder = Order::where('guest_id', $guest_id)->whereNull('date')->first();
            $userOrder = auth()->user()->orders()->whereNull('date')->first();
            if ($guestOrder) {
                if (!$userOrder) {
                    $guestOrder->update([
                        'user_id' => auth()->user()->id,
                        'guest_id' => null
                    ]);
                }
                else{
                    $products = $guestOrder->products;

                    foreach ($products as $product) {
                        $userProduct = $userOrder->products()->where('product_id', $product->id)->first();
                        $userOrder->products()->syncWithoutDetaching($product->id, ['quantity' => $product->pivot->quantity]);
                    }

                    $guestOrder->products()->detach();
                }
            }

            DB::commit();
        }catch (Exception $e){
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }
}
