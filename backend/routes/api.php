<?php

use App\Http\Controllers\API\PageController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('user');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::apiResource('pages', PageController::class);
});