<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, Filterable;
    protected $guarded = false;
    protected $table = 'categories';
    public function products(){
        return $this->hasMany(Product::class, 'category_id', 'id');
    }
}
