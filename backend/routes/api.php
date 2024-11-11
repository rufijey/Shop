<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 112313;
});


Route::group(['prefix' => 'account'], function () {
    Route::post('verify/{id}/{hash}/{fingerprint}', [AccountController::class, 'verify']);
    Route::get('verify/resend/{email}', [AccountController::class, 'resendEmail']);
    Route::post('password/forgot', [AccountController::class, 'sendPasswordResetLink']);
    Route::post('password/reset', [AccountController::class, 'resetPassword']);
});


//Route::group(['prefix' => 'user'], function () {
//    Route::get('/', [UserController::class, 'index']);
//    Route::post('/', [UserController::class, 'store']);
//
//});

Route::group(['middleware' => ['auth:api']], function () {
    Route::group(['middleware' => 'role:admin'], function () {
        Route::group(['prefix' => 'categories'], function () {
            Route::get('/', [CategoryController::class, 'index'])->withoutMiddleware(['auth:api', 'role:admin']);
            Route::get('/{category}', [CategoryController::class, 'show'])->withoutMiddleware(['auth:api', 'role:admin']);
            Route::post('/', [CategoryController::class, 'store']);
            Route::patch('/{category}', [CategoryController::class, 'update']);
            Route::delete('/{category}', [CategoryController::class, 'destroy']);
        });
        Route::group(['prefix' => 'products'], function () {
            Route::get('/', [ProductController::class, 'index'])->withoutMiddleware(['auth:api', 'role:admin']);
            Route::get('/max-price', [ProductController::class, 'getMaxPrice'])
                ->withoutMiddleware(['auth:api', 'role:admin']);
            Route::get('/filters', [ProductController::class, 'getFilters'])
                ->withoutMiddleware(['auth:api', 'role:admin']);
            Route::get('/{product}', [ProductController::class, 'show'])->withoutMiddleware(['auth:api', 'role:admin']);
            Route::post('/', [ProductController::class, 'store']);
            Route::patch('/{product}', [ProductController::class, 'update']);
            Route::delete('/{product}', [ProductController::class, 'destroy']);
        });
        Route::group(['prefix' => 'tags'], function () {
            Route::get('/', [TagController::class, 'index'])->withoutMiddleware(['auth:api', 'role:admin']);
            Route::get('/{tag}', [TagController::class, 'show'])->withoutMiddleware(['auth:api', 'role:admin']);
            Route::post('/', [TagController::class, 'store']);
            Route::patch('/{tag}', [TagController::class, 'update']);
            Route::delete('/{tag}', [TagController::class, 'destroy']);
        });
    });

    Route::group(['prefix' => 'reviews'], function () {
        Route::get('/', [ReviewController::class, 'index'])->withoutMiddleware(['auth:api']);
        Route::get('/{review}', [ReviewController::class, 'show'])->withoutMiddleware(['auth:api']);
        Route::post('/', [ReviewController::class, 'store']);
        Route::patch('/{review}', [ReviewController::class, 'update']);
        Route::delete('/{review}', [ReviewController::class, 'destroy']);
    });

    Route::group(['prefix' => 'user'], function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/email', [UserController::class, 'show'])->middleware(['role:admin']);
        Route::patch('/makeAdmin/{user}', [UserController::class, 'makeAdmin'])->middleware(['role:admin']);
        Route::patch('/makeUnAdmin/{user}', [UserController::class, 'makeUnAdmin'])->middleware(['role:admin']);
    });

});
Route::group(['prefix' => 'orders'], function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/completed', [OrderController::class, 'getCompletedOrders']);
    Route::get('/current', [OrderController::class, 'getCurrentOrder']);
    Route::post('/current', [OrderController::class, 'addProduct']);
    Route::delete('/products/{product}', [OrderController::class, 'removeProduct']);
    Route::delete('/{order}', [OrderController::class, 'destroy']);
    Route::patch('/complete', [OrderController::class, 'completeOrder']);
    Route::delete('/current', [OrderController::class, 'deleteCurrentOrder']);
    Route::patch('/quantity', [OrderController::class, 'changeQuantity']);
});

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

