<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ResetPasswordRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\VerifyRequest;
use App\Models\User;
use App\Notifications\CustomResetPassword;
use App\Notifications\CustomVerifyEmail;
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

    public $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function verify(VerifyRequest $request) {
        $data = $request->validated();
        $user = User::find($data['id']);

        if (!$user) {
            return response('User not found');
        }

        if (!hash_equals((string) $data['hash'], sha1($user->getEmailForVerification()))) {
            return response('Invalid verification link');
        }
        if ($user->hasVerifiedEmail()) {
            $token = auth('api')->login($user);
            return $this->authService->getResponseWithTokens($token, $data['fingerprint']);
        }

        $user->email_verified_at = Carbon::now();
        $user->save();

//        $token = JWTAuth::fromUser($user);
        $token = auth('api')->login($user);
        return $this->authService->getResponseWithTokens($token, $data['fingerprint']);
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

        $user = DB::table('users')->where('email', $data['email'])->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $token = Str::random(60);

        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();

        DB::table('password_reset_tokens')->insert([
            'email' => $data['email'],
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        $user = User::where('email', $data['email'])->first();
        $user->notify(new CustomResetPassword($token, $data['email']));

        return response()->json(['message' => 'Reset password link sent.']);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $data = $request->validated();

        $reset = DB::table('password_reset_tokens')
            ->where('email', $data['email'])
            ->where('token', $data['token'])
            ->first();

        if (!$reset) {
            return response()->json(['error' => 'Invalid token or email'], 400);
        }

        $user = User::where('email', $data['email'])->first();
        $user->password = Hash::make($data['password']);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }

}
