<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'kasir',
        'payment_method',
        'order_type',
        'customer_name',
        'table_seat',
        'subtotal',
        'tax',
        'total',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'tax' => 'float',
        'total' => 'float',
    ];

    public function items()
    {
        return $this->hasMany(TransactionItem::class, 'transaction_id');
    }
}
