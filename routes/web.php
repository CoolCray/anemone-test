<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Root route - Franchise System SPA
Route::get('/', function () {
    return view('spa');
})->name('home');

// Catch-all route untuk React Router
Route::get('/{any}', function () {
    return view('spa');
})->where('any', '^(?!api|dashboard|settings).*$')->name('franchise.spa');

// Inertia routes (opsional, untuk backward compatibility)
Route::get('/inertia-welcome', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('inertia.welcome');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/settings.php';
