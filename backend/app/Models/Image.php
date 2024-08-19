<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;
    protected $guarded=false;
    protected $table = 'images';
    public function post(){
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
