<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class OrderResource extends JsonResource
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
            'user_id' => $this->user_id,
            'products'=>OrderProductResource::collection($this->products),
            'total_price' => $this->products()->sum(DB::raw('products.price * order_product.quantity')),
            'products_quantity' => $this->products()->sum('order_product.quantity'),
        ];
    }
}
