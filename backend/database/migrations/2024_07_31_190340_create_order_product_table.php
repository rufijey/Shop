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
        Schema::create('order_product', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->index('order_product_product_idx');
            $table->unsignedBigInteger('order_id')->index('order_product_order_idx');

            $table->foreign('product_id', 'order_product_product_idx')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');
            $table->foreign('order_id', 'order_product_order_idx')
                ->references('id')
                ->on('orders')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_product');
    }
};
