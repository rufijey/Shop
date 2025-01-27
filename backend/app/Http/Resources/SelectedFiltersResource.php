<?php

namespace App\Http\Resources;

use App\Models\Category;
use App\Models\Product;
use App\Models\Characteristic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SelectedFiltersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'characteristics' =>
                $this['characteristics'] != null ? CharacteristicResource::collection($this['characteristics']) : null,
            'category' => $this['category'] != null ? new CategoryResource($this['category']) : null,
        ];
    }
}
