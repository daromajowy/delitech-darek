<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->string('role')->default('member');
            $t->boolean('active')->default(true);
            $t->text('app_authentication_secret')->nullable();
            $t->text('app_authentication_recovery_codes')->nullable();
        });
        Schema::create('projects', function (Blueprint $t) {
            $t->uuid('id')->primary();
            $t->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $t->string('name', 600);
            $t->string('studio', 600)->default('');
            $t->string('status')->default('draft');
            $t->unsignedInteger('revision')->default(0);
            $t->json('payload');
            $t->timestamps();
        });
        Schema::create('project_user', function (Blueprint $t) {
            $t->uuid('project_id');
            $t->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->primary(['project_id', 'user_id']);
        });
        Schema::create('project_revisions', function (Blueprint $t) {
            $t->id();
            $t->uuid('project_id');
            $t->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $t->unsignedInteger('revision');
            $t->foreignId('author_id')->constrained('users')->restrictOnDelete();
            $t->json('payload');
            $t->timestamp('created_at');
            $t->unique(['project_id', 'revision']);
        });
        Schema::create('project_submissions', function (Blueprint $t) {
            $t->uuid('id')->primary();
            $t->uuid('project_id');
            $t->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $t->unsignedInteger('revision');
            $t->foreignId('author_id')->constrained('users')->restrictOnDelete();
            $t->json('payload');
            $t->timestamp('created_at');
        });
        Schema::create('documents', function (Blueprint $t) {
            $t->uuid('id')->primary();
            $t->uuid('project_id');
            $t->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
            $t->string('name');
            $t->string('path');
            $t->string('mime', 100);
            $t->unsignedBigInteger('size');
            $t->boolean('active')->default(true);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['documents', 'project_submissions', 'project_revisions', 'project_user', 'projects'] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn(['role', 'active', 'app_authentication_secret', 'app_authentication_recovery_codes']));
    }
};
