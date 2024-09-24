<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreRequest;
use App\Models\User;
use App\Notifications\CustomVerifyEmail;
use App\Services\AuthService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class VerificationController extends Controller
{

    public $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function verify($id, $hash, $fingerprint) {
        $user = User::find($id);

        if (!$user) {
            return response('User not found');
        }

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response('Invalid verification link');
        }
        if ($user->hasVerifiedEmail()) {
            $token = auth('api')->login($user);
            return $this->authService->getResponseWithTokens($token, $fingerprint);
        }

        $user->email_verified_at = Carbon::now();
        $user->save();

//        $token = JWTAuth::fromUser($user);
        $token = auth('api')->login($user);
        return $this->authService->getResponseWithTokens($token, $fingerprint);
    }

    public function resend($email)
    {
        $user = User::where('email', $email)->first();
        $user->notify(new CustomVerifyEmail());

        return response()->json(['message' => 'Verification link sent!']);
    }

}
