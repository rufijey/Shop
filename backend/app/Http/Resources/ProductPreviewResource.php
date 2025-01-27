<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductPreviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'title'=>$this->title,
            'description'=>$this->description,
            'price'=>$this->price,
            'quantity' => $this->pivot ? $this->pivot->quantity : null,
            'total_quantity'=>$this->quantity,
            'rating'=>$this->rating,
            'images' => ImageResource::collection($this->images),
            'slug'=> $this->slug,
        ];
    }
}
