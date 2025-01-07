<?php

namespace App\Http\Resources;

use App\Models\Category;
use App\Models\Product;
use App\Models\Characteristic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FiltersResourceNoGroup extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'characteristics' => CharacteristicResource::collection($this['characteristics']),
            'categories' => CategoryResource::collection($this['categories']),
            'max_price' => $this['max_price'],
        ];
    }
}
