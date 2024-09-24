<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'quantity'=>$this->quantity,
            'rating'=>$this->rating,
            'category' => new CategoryResource($this->category),
            'tags' => TagResource::collection($this->tags),
            'images' => ImageResource::collection($this->images),
//            'reviews' => ReviewResource::collection( $this->reviews()
//                ->when(auth()->check(), function($query) {
//                    return $query->where('user_id', '!=', auth()->id());
//                })
//                ->latest()
//                ->get()),
            'reviews' => ReviewResource::collection($this->reviews()->latest()->get()),
            'user_review' =>  auth()->check()
                ? new ReviewResource($this->reviews()->where('user_id', auth()->id())->first())
                : null,
            'is_reviewed'=> auth()->check() && $this->reviews()->where('user_id', auth()->id())->exists(),
            'slug'=> $this->slug,
        ];
    }
}
