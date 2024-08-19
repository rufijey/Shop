<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index('review_user_idx');
            $table->unsignedBigInteger('product_id')->index('product_review_idx');
            $table->text('content');
            $table->date('date')->nullable();
            $table->timestamps();

            $table->foreign('user_id', 'review_user_fk')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');;
            $table->foreign('product_id', 'product_review_fk')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
