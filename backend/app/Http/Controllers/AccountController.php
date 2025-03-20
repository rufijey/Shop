<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ResetPasswordRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\VerifyRequest;
use App\Models\User;
use App\Notifications\CustomResetPassword;
use App\Notifications\CustomVerifyEmail;
use App\Services\AccountService;
use App\Services\AuthService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AccountController extends Controller
{
    public AccountService $accountService;

    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }
    public function verify(VerifyRequest $request): JsonResponse
    {
        $data = $request->validated();
        return $this->accountService->verify($data);
    }

    public function resendEmail($email): void
    {
        $user = User::where('email', $email)->first();
        $user->notify(new CustomVerifyEmail());

    }

    public function sendPasswordResetLink(Request $request): void
    {
        $data = $request->validate(['email' => 'required|email']);
        $this->accountService->sendPasswordResetLink($data);

    }

    public function resetPassword(ResetPasswordRequest $request): void
    {
        $data = $request->validated();
        $this->accountService->resetPassword($data);

    }
}
