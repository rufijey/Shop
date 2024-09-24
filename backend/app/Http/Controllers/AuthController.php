<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public $service;

    public function __construct(AuthService $service)
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh', 'register']]);
        $this->service = $service;
    }

    public function register(StoreRequest $request)
    {
        $data = $request->validated();
        return $this->service->register($data);
    }

    public function login()
    {
        $credentials = request(['email', 'password']);
        $fingerprint = request('fingerprint');
        return $this->service->login($credentials, $fingerprint);
    }

    public function me()
    {
        return $this->service->me();
    }

    public function logout()
    {
        $fingerprint = request('fingerprint');
        return $this->service->logout($fingerprint);
    }

    public function refresh()
    {
        $refreshToken = request()->cookie('refresh_token');
        $fingerprint = request('fingerprint');
        return $this->service->refresh($refreshToken, $fingerprint);
    }

}
