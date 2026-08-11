<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'verified',
        'discount_pct',
        'discount_status',
        'notes',
    ];

    protected $casts = [
        'verified' => 'boolean',
        'discount_pct' => 'integer',
    ];
}
