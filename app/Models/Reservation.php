<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'res_date',
        'res_time',
        'people',
        'table_num',
        'items',
        'total_order',
        'status',
    ];

    protected $casts = [
        'people' => 'integer',
        'items' => 'array',
        'total_order' => 'float',
    ];
}
