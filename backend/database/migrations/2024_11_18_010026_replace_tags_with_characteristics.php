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

        Schema::table('product_tag', function (Blueprint $table) {
            $table->dropForeign('product_tag_product_fk');
            $table->dropForeign('product_tag_tag_fk');
        });
        Schema::dropIfExists('product_tag');
        Schema::dropIfExists('tags');

        Schema::create('characteristic_types', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
        });

        Schema::create('characteristics', function (Blueprint $table) {
            $table->id();
            $table->string('body');
            $table->unsignedBigInteger('type_id')->index('characteristics_type_idx');
            $table->timestamps();

            $table->foreign('type_id', 'characteristics_type_fk')
                ->references('id')
                ->on('characteristic_types')
                ->onDelete('cascade');
        });

        Schema::create('characteristic_product', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->index('characteristic_product_product_idx');
            $table->unsignedBigInteger('characteristic_id')->index('characteristic_product_characteristic_idx');

            $table->foreign('product_id', 'characteristic_product_product_fk')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');
            $table->foreign('characteristic_id', 'characteristic_product_characteristic_fk')
                ->references('id')
                ->on('characteristics')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('characteristic_product', function (Blueprint $table) {
            $table->dropForeign('characteristic_product_product_fk');
            $table->dropForeign('characteristic_product_characteristic_fk');
        });
        Schema::dropIfExists('characteristic_product');

        Schema::table('characteristics', function (Blueprint $table) {
            $table->dropForeign('characteristics_type_fk');
        });
        Schema::dropIfExists('characteristics');

        Schema::dropIfExists('characteristic_types');

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
        });

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
};
