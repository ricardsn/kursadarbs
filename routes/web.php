<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservoirController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::any('/reservoir/saveCoordinates', [ReservoirController::class, 'saveCoordinates']);
Route::any('/reservoir/{reservoirId}/update', [ReservoirController::class, 'update']);
Route::get('/reservoir/getCoordinates', [ReservoirController::class, 'getCoordinates']);
Route::get('/reservoir/showCoordinates', [ReservoirController::class, 'showCoordinates'])->name('show');
Route::get('/reservoir/{reservoirId}/getCoordinateEdit', [ReservoirController::class, 'getCoordinateEdit']);
//Route::post('reservoir/getCoordinates','App\Http\Controllers\ReservoirController@getCoordinates')->name('getCoordinates');

Route::resource('reservoir', 'App\Http\Controllers\ReservoirController');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
