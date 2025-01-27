<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Characteristic extends Model
{
    use HasFactory, Filterable;

    protected $guarded = false;
    protected $table = 'characteristics';

    public function products()
    {
        return $this->belongsToMany(Product::class,
            'characteristic_product', 'characteristic_id', 'product_id');
    }
    public function type()
    {
        return $this->belongsTo(CharacteristicType::class, 'type_id', 'id');
    }
}
