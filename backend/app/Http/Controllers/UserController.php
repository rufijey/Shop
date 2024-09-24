<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $user = User::latest()->first();
        return response()->json($user);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $user = User::FirstOrCreate([
            'email' => $data['email']
        ], $data);
        return response()->json($user);
    }

    public function show(Request $request)
    {
        $email = $request->get('email');
        $user = User::where('email', $email)->first();
        if($user){
            return new UserResource($user);
        }
        else{
            return response(['message'=>'User not found!']);
        }

    }

    public function makeAdmin(User $user)
    {
        $user['role'] = 'admin';
        $user->update();
    }

    public function makeUnAdmin(User $user)
    {
        $user['role'] = 'user';
        $user->update();
    }

}
