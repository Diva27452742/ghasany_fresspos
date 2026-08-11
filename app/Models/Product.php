<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'price',
        'category',
        'image',
        'stock',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];

    public function categoryRef()
    {
        return $this->belongsTo(Category::class, 'category', 'id');
    }
}
