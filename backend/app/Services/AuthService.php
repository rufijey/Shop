<?php

namespace App\Services;

use App\Http\Requests\User\StoreRequest;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthService
{
    public function register($data)
    {
        $credentials = ['email' => $data['email'], 'password' => $data['password']];
        $fingerprint = $data['fingerprint'];
        $data['password'] = Hash::make($data['password']);
        User::FirstOrCreate([
            'email' => $data['email']
        ], $data);
        return $this->login($credentials, $fingerprint);
    }

    public function login($credentials, $fingerprint)
    {
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        RefreshToken::invalidateToken($fingerprint);
        $refreshToken = RefreshToken::createToken($fingerprint);
        $cookie = cookie('refresh_token', $refreshToken, config('jwt.refresh_ttl'), null, null, true, true);
        return $this->respondWithToken($token, $refreshToken)->withCookie($cookie);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout($fingerprint)
    {
        RefreshToken::invalidateToken($fingerprint);
        auth()->logout();

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
            $newRefreshToken = RefreshToken::createToken($fingerprint);

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
}
