<?php

namespace App\Services;

use App\Http\Requests\User\StoreRequest;
use App\Models\Order;
use App\Models\RefreshToken;
use App\Models\User;
use App\Notifications\CustomVerifyEmail;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\CssSelector\Exception\InternalErrorException;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthService
{
    public OrderService $orderService;
    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }
    public function register($data): JsonResponse
    {
        try {
            DB::beginTransaction();
            $data['password'] = Hash::make($data['password']);

            $user = User::firstOrCreate(['email' => $data['email']], $data);

            $user->notify(new CustomVerifyEmail());
            DB::commit();
            return response()->json(['message' => 'Please verify your email address.'], 201);
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }

    public function login($credentials, $fingerprint): JsonResponse
    {
        $token = auth()->attempt($credentials);
        if (!$token) {
            throw new UnauthorizedException();
        }

        if (!auth()->user()->hasVerifiedEmail()) {
            throw new Exception('Email is not verified.', 403);
        }

        return $this->getResponseWithTokens($token, $fingerprint);
    }

    public function getResponseWithTokens($token, $fingerprint): JsonResponse
    {
        $this->invalidateRefreshToken($fingerprint);
        $refreshToken = $this->createRefreshToken($fingerprint);
        $cookie = cookie('refresh_token', $refreshToken, config('jwt.refresh_ttl'), null, null, true, true);
        $this->orderService->syncOrders();
        return $this->respondWithToken($token)->withCookie($cookie);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth()->user());
    }

    public function logout($fingerprint): void
    {
        $this->invalidateRefreshToken($fingerprint);
        auth()->logout();
    }

    public function refresh($refreshToken, $fingerprint): JsonResponse
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
            return $this->respondWithToken($token)->withCookie($cookie);
        } catch (JWTException $e) {
           throw new InternalErrorException('Could not refresh token', 500, $e);
        }

    }

    protected function respondWithToken(string $token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }

    public static function createRefreshToken(string $fingerprint): string
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

    public static function invalidateRefreshToken(string $fingerprint): void
    {
        $userId = auth()->user()->id;
        RefreshToken::where('user_id', $userId)
            ->where('fingerprint', $fingerprint)
            ->delete();
    }

}
