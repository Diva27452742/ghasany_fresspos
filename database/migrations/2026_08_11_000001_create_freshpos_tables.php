<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('name', 100);
            $table->string('icon', 50);
            $table->timestamps();
        });

        // 2. Products Table
        Schema::create('products', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('name', 255);
            $table->decimal('price', 15, 2);
            $table->string('category', 50);
            $table->string('image', 255);
            $table->integer('stock')->default(0);
            $table->timestamps();

            $table->foreign('category')->references('id')->on('categories')->onDelete('cascade');
        });

        // 3. Transactions Table
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 50);
            $table->string('kasir', 100);
            $table->string('payment_method', 50);
            $table->string('order_type', 50)->default('Dine In');
            $table->string('customer_name', 255)->nullable();
            $table->string('table_seat', 50)->nullable();
            $table->decimal('subtotal', 15, 2);
            $table->decimal('tax', 15, 2);
            $table->decimal('total', 15, 2);
            $table->timestamps();
        });

        // 4. Transaction Items Table
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
            $table->string('product_id', 50);
            $table->string('product_name', 255);
            $table->decimal('price', 15, 2);
            $table->integer('qty');
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });

        // 5. Members Table
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->boolean('verified')->default(false);
            $table->integer('discount_pct')->default(0);
            $table->string('discount_status', 50)->default('Aktif');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 6. Reservations Table
        Schema::create('reservations', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('name', 255);
            $table->date('res_date');
            $table->time('res_time');
            $table->integer('people');
            $table->string('table_num', 50)->nullable();
            $table->json('items')->nullable();
            $table->decimal('total_order', 15, 2)->default(0.00);
            $table->string('status', 50)->default('Menunggu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('members');
        Schema::dropIfExists('transaction_items');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
