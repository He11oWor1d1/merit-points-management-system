<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\InvitationCodeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\TeachersController;
use App\Http\Controllers\LeaderboardController;

Route::prefix('v1')->group(function (){
  Route::post('check-auth', [LoginController::class, 'CheckAuth']);

  Route::post('login', [LoginController::class, 'Login']);
  Route::post('logout', [LoginController::class, 'Logout']);

  Route::prefix('admin')->group(function(){
    Route::post('signup', [AdminController::class, 'SignUp']);
    Route::post('create-inv-code', [AdminController::class, 'CreateInvitationCode']);
    // admin dashboard routes
    Route::get('overview', [AdminController::class, 'Overview']);
    Route::get('transaction-history', [AdminController::class, 'TransactionHistory']);
    Route::get('manage-students', [AdminController::class, 'ManageStudents']);
    Route::get('manage-teachers', [AdminController::class, 'ManageTeachers']);
    Route::get('manage-merit-points', [AdminController::class, 'ManageMeritPoints']);
    Route::post('initial', [AdminController::class, 'SetInitial']);
    Route::get('initial', [AdminController::class, 'GetInitial']);
    Route::get('point-threshold', [AdminController::class, 'GetPointThreshold']);
    Route::get('student-by-class', [AdminController::class, 'GetStudentByClass']);
    Route::post('student-details', [AdminController::class, 'GetStudentDetails']);
    Route::patch('point/{receiver_id}', [AdminController::class, 'UpdatePoint']);
    Route::post('search-student', [AdminController::class, 'SearchStudent']);
    Route::get('notification', [AdminController::class, 'GetNotification']);
    Route::patch('mark-notification-as-read', [AdminController::class, 'MarkNotificationAsRead']);
  });
  Route::get('leaderboard', [LeaderboardController::class, 'Leaderboard']);

  Route::post('teacher/signup', [TeachersController::class, 'SignUp']);
  Route::post('student/signup', [StudentsController::class, 'SignUp']);

  Route::post('validate-inv-code', [InvitationCodeController::class, 'ValidateInvitationCode']);
});
