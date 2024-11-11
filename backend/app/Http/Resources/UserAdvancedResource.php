<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserAdvancedResource extends JsonResource
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
            'name'=>$this->name,
            'email'=>$this->email,
            'role'=>$this->role,
            'reviews'=>ReviewProductResource::collection($this->reviews()->latest()->get()),
            'orders'=>OrderResource::collection($this->orders()->whereNotNull('date')->latest()->get()),
        ];
    }
}
