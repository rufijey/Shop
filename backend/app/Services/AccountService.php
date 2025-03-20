<?php

namespace App\Services;

use App\Http\Requests\User\ResetPasswordRequest;
use App\Http\Requests\User\VerifyRequest;
use App\Models\User;
use App\Notifications\CustomResetPassword;
use App\Notifications\CustomVerifyEmail;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class AccountService
{
    public AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function verify($data): JsonResponse {
        $user = User::find($data['id']);

        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        if (!hash_equals((string) $data['hash'], sha1($user->getEmailForVerification()))) {
            throw new UnauthorizedHttpException('Invalid hash');
        }
        if ($user->hasVerifiedEmail()) {
            $token = auth('api')->login($user);
            return $this->authService->getResponseWithTokens($token, $data['fingerprint']);
        }

        $user->email_verified_at = Carbon::now();
        $user->save();

        $token = auth('api')->login($user);
        return $this->authService->getResponseWithTokens($token, $data['fingerprint']);
    }


    public function sendPasswordResetLink($data): void
    {

        $user = DB::table('users')->where('email', $data['email'])->first();

        if (!$user) {
            throw new NotFoundHttpException('User not found');
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
    }

    public function resetPassword($data): void
    {

        $reset = DB::table('password_reset_tokens')
            ->where('email', $data['email'])
            ->where('token', $data['token'])
            ->first();

        if (!$reset) {
            throw new BadRequestException('Invalid token or email');
        }

        $user = User::where('email', $data['email'])->first();
        $user->password = Hash::make($data['password']);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
    }
}
