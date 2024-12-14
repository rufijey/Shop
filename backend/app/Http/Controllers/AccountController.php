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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AccountController extends Controller
{
    public $accountService;

    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }
    public function verify(VerifyRequest $request) {
        $data = $request->validated();
        return $this->accountService->verify($data);
    }

    public function resendEmail($email)
    {
        $user = User::where('email', $email)->first();
        $user->notify(new CustomVerifyEmail());

        return response()->json(['message' => 'Verification link sent!']);
    }

    public function sendPasswordResetLink(Request $request)
    {
        $data = $request->validate(['email' => 'required|email']);
        return $this->accountService->sendPasswordResetLink($data);

    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $data = $request->validated();
        return $this->accountService->resetPassword($data);

    }
}
