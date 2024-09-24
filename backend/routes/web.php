<?php

use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

//Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
//    ->middleware(['signed'])->name('verification.verify');

//Route::post('email/resend', function (Request $request) {
//    $request->user()->sendEmailVerificationNotification();
//
//    return response()->json(['message' => 'Verification link sent!']);
//})->name('verification.send');
