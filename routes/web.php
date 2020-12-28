<?php

use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservoirController;
use \App\Http\Controllers\ForumController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\FishController;

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
Route::get('/forum/{forumId}/getComments', [ForumController::class, 'getComments']);
Route::any('/forum/{forumId}/update', [ForumController::class, 'update'])->name('updateForum');
Route::any('/fish/storeFish', [FishController::class, 'storeFish']);
Route::any('/comment/store', [CommentController::class, 'store']);
Route::any('/fish/{fishId}/update', [FishController::class, 'update']);

Route::resource('reservoir', 'App\Http\Controllers\ReservoirController');
Route::resource('forum', 'App\Http\Controllers\ForumController');
Route::resource('comment', CommentController::class);
Route::resource('fish', FishController::class);

Auth::routes();

Route::get('/', function () {return view('welcome');})->name('home');
