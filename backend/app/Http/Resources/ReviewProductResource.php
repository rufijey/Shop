<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'rating'=> $this->rating,
            'date'=> $this->created_at,
            'product'=> new ProductPreviewResource($this->product),
//            'is_users'=> auth()->check() && auth()->user()->id === $this->user->id,
        ];
    }
}
