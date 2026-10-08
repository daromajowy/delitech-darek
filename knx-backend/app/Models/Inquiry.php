<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['id', 'reference', 'kind', 'payload', 'files'];

    protected function casts(): array
    {
        return ['payload' => 'encrypted:array', 'files' => 'encrypted:array'];
    }
}
