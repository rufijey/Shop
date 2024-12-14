<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CharacteristicType extends Model
{
    use HasFactory, Filterable;

    protected $guarded = false;
    protected $table = 'characteristic_types';

    public function characteristics()
    {
        return $this->hasMany(Characteristic::class, 'type_id', 'id');
    }
}
