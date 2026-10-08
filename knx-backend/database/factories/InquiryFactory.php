<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InquiryFactory extends Factory
{
    public function definition(): array
    {
        return ['reference' => 'TEST-'.Str::random(10), 'kind' => 'project', 'payload' => ['name' => fake()->name(), 'email' => fake()->safeEmail()], 'files' => []];
    }
}
