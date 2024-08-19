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
        Schema::create('product_tag', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->index('product_tag_product_idx');
            $table->unsignedBigInteger('tag_id')->index('product_tag_tag_idx');

            $table->foreign('product_id', 'product_tag_product_fk')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');
            $table->foreign('tag_id', 'product_tag_tag_fk')
                ->references('id')
                ->on('tags')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_tag');
    }
};
