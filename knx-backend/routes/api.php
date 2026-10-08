<?php

use App\Http\Controllers\InquiryController;
use Illuminate\Support\Facades\Route;

Route::post('/inquiries', [InquiryController::class, 'store'])->middleware('throttle:20,60')->name('inquiries.store');
