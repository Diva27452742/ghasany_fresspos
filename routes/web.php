<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ApiController;

// Halaman Utama POS
Route::get('/', [PosController::class, 'index'])->name('pos.index');

// API Endpoints (Laravel Standard & Compatibility dengan legacy JS path)
Route::group(['prefix' => 'api'], function () {
    Route::get('/categories', [ApiController::class, 'getCategories']);
    Route::post('/categories/save', [ApiController::class, 'saveCategory']);
    Route::post('/categories/delete', [ApiController::class, 'deleteCategory']);

    Route::get('/products', [ApiController::class, 'getProducts']);
    Route::get('/get_products.php', [ApiController::class, 'getProducts']);

    Route::post('/products/save', [ApiController::class, 'saveProduct']);
    Route::post('/products/delete', [ApiController::class, 'deleteProduct']);

    Route::post('/checkout', [ApiController::class, 'checkout']);
    Route::post('/checkout.php', [ApiController::class, 'checkout']);

    Route::get('/members', [ApiController::class, 'getMembers']);
    Route::get('/get_members.php', [ApiController::class, 'getMembers']);

    Route::post('/members/save', [ApiController::class, 'saveMember']);
    Route::post('/save_member.php', [ApiController::class, 'saveMember']);

    Route::post('/members/delete', [ApiController::class, 'deleteMember']);
    Route::post('/delete_member.php', [ApiController::class, 'deleteMember']);

    Route::get('/history', [ApiController::class, 'getHistory']);
    Route::get('/get_history.php', [ApiController::class, 'getHistory']);

    Route::post('/history/clear', [ApiController::class, 'clearHistory']);
    Route::post('/clear_history.php', [ApiController::class, 'clearHistory']);

    Route::post('/reservations/save', [ApiController::class, 'saveReservation']);
    Route::post('/save_reservation.php', [ApiController::class, 'saveReservation']);

    Route::post('/reservations/update-status', [ApiController::class, 'updateReservationStatus']);
    Route::post('/update_reservation_status.php', [ApiController::class, 'updateReservationStatus']);

    Route::post('/stock/update', [ApiController::class, 'updateStock']);
    Route::post('/update_stock.php', [ApiController::class, 'updateStock']);
});

// Alias Route untuk request Javascript ke `php/api/*.php`
Route::group(['prefix' => 'php/api'], function () {
    Route::get('/get_products.php', [ApiController::class, 'getProducts']);
    Route::post('/checkout.php', [ApiController::class, 'checkout']);
    Route::get('/get_members.php', [ApiController::class, 'getMembers']);
    Route::post('/save_member.php', [ApiController::class, 'saveMember']);
    Route::post('/delete_member.php', [ApiController::class, 'deleteMember']);
    Route::get('/get_history.php', [ApiController::class, 'getHistory']);
    Route::post('/clear_history.php', [ApiController::class, 'clearHistory']);
    Route::post('/save_reservation.php', [ApiController::class, 'saveReservation']);
    Route::post('/update_reservation_status.php', [ApiController::class, 'updateReservationStatus']);
    Route::post('/update_stock.php', [ApiController::class, 'updateStock']);
});
