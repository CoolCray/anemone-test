<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Products - All roles can view
    Route::get('/products', [ProductController::class, 'index']);

    // Products - Only HO can create, update, delete
    Route::middleware('role:ho')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });

    // Orders - All authenticated users
    Route::get('/orders', [OrderController::class, 'index']);

    // Orders - Only Outlet can create
    Route::middleware('role:outlet')->group(function () {
        Route::post('/orders', [OrderController::class, 'store']);
    });

    // Orders - Only HO can update status
    Route::middleware('role:ho')->group(function () {
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });

    // Dashboard - Only HO can access
    Route::middleware('role:ho')->group(function () {
        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    });
});
