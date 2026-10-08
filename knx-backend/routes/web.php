<?php

use App\Http\Controllers\InquiryController;
use App\Http\Controllers\PlannerController;
use App\Http\Middleware\WorkspaceAccess;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('planner'));
Route::middleware(['auth', 'auth.session', WorkspaceAccess::class])->group(function () {
    Route::get('/inquiries/{inquiry}', [InquiryController::class, 'show'])->name('inquiries.show');
    Route::get('/inquiries/{inquiry}/files/{index}', [InquiryController::class, 'download'])->name('inquiries.download');
    Route::get('/editor', fn () => view('planner'))->name('planner');
    Route::match(['GET', 'PUT', 'POST'], '/api', [PlannerController::class, 'dispatch'])->middleware('throttle:180,1');
    Route::get('/projects/{project}/download', function (Request $r, string $project) {
        $p = Project::accessibleTo($r->user())->findOrFail($project);

        return response()->streamDownload(fn () => print (json_encode($p->toPlanner(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)), 'projekt-knx.json', ['Content-Type' => 'application/json']);
    })->name('project.download');
});
