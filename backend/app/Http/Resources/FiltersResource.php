<?php

namespace App\Http\Resources;

use App\Models\Category;
use App\Models\Product;
use App\Models\Characteristic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FiltersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $groupedCharacteristics = $this['grouped_characteristics']
            ->map(fn($group) => [
                'type' => $group->first()->type->title,
                'characteristics' => CharacteristicResource::collection($group),
            ])
            ->values()
            ->toArray();

        return [
            'grouped_characteristics' => $groupedCharacteristics,
            'categories' => CategoryResource::collection($this['categories']),
            'max_price' => $this['max_price'],
        ];
    }
}
