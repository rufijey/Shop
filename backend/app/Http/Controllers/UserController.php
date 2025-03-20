<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreRequest;
use App\Http\Resources\UserAdvancedResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserController extends Controller
{
    public function index(): UserAdvancedResource
    {
        $user = auth()->user();
        return new UserAdvancedResource($user);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $user = User::FirstOrCreate([
            'email' => $data['email']
        ], $data);
        return response()->json($user);
    }

    public function show(Request $request): UserResource
    {
        $email = $request->get('email');
        $user = User::where('email', $email)->first();
        if($user){
            return new UserResource($user);
        }
        else{
            throw new NotFoundHttpException('user not found');
        }

    }

    public function makeAdmin(User $user): void
    {
        $user->role = 'admin';
        $user->update();
    }

    public function makeUnAdmin(User $user): void
    {
        $user->role = 'user';
        $user->update();
    }

}
