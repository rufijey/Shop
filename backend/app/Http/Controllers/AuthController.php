<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\LoginRequest;
use App\Http\Requests\User\StoreRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public AuthService $authService;

    public function __construct(AuthService $service)
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh', 'register']]);
        $this->authService = $service;
    }

    public function register(StoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        return $this->authService->register($data);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];
        $fingerprint = $data['fingerprint'];
        return $this->authService->login($credentials, $fingerprint);
    }

    public function me(): JsonResponse
    {
        return $this->authService->me();
    }

    public function logout(): void
    {
        $fingerprint = request('fingerprint');
        $this->authService->logout($fingerprint);
    }

    public function refresh(): JsonResponse
    {
        $refreshToken = request()->cookie('refresh_token');
        $fingerprint = request('fingerprint');
        return $this->authService->refresh($refreshToken, $fingerprint);
    }

}
