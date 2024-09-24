<?php

namespace App\Services;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function index()
    {
        $user = auth()->user();
        return OrderResource::collection($user->orders);
    }

    public function completed()
    {
        $user = auth()->user();
        $orders = $user->orders()->whereNotNull('date')->get();
        return OrderResource::collection($orders);
    }

    public function current()
    {
        $order = $this->findCurrentOrder();
        if ($order instanceof \Illuminate\Http\Response) {
            return $order;
        }
        if ($order) {
            return new OrderResource($order);
        }
    }

    public function addProduct($data)
    {
        $token = auth()->getToken();
        if ($token) {
            if (!auth()->check()) {
                return response('Unauthorized.', 401);
            }

            $user = auth()->user();
            $order = $user->orders()->whereNull('date')->latest()->first();
            if (!$order) {
                $order = $user->orders()->create();
            }
        } else {
            $guest_id = request()->cookie('guest_id');
            if($guest_id) {
                $order = Order::where('guest_id', $guest_id)->whereNull('date')->latest()->first();
                if(!$order){
                    $order = Order::create(['guest_id' => $guest_id]);
                }
            }
        }

        $order->products()->syncWithoutDetaching([
            $data['product_id'] => ['quantity' => 1]
        ]);

        return new OrderResource($order);
    }

    public function removeProduct($product_id)
    {
        $order = $this->findCurrentOrder();
        if ($order instanceof \Illuminate\Http\Response) {
            return $order;
        }
        $order->products()->detach($product_id);
        return response()->json(['message' => 'Product removed from order'], 200);
    }

    public function complete()
    {
        $user = auth()->user();
        $order = $user->orders()->whereNull('date')->first();
        if ($order) {
            $order->update(['date' => today()]);
            return response()->json(['message' => 'Current order completed'], 200);
        }
    }
    public function changeQuantity($quantity, $product_id)
    {
        $order = $this->findCurrentOrder();
        if ($order instanceof \Illuminate\Http\Response) {
            return $order;
        }
        if($order->products()->where('product_id', $product_id)->exists()) {
            $order->products()->updateExistingPivot($product_id, ['quantity' => $quantity]);
            $quantity = $order->products()->where('product_id', $product_id)->first()->pivot->quantity;
            return response($quantity, 200);
        }
    }
    public function deleteCurrent()
    {
        $order = $this->findCurrentOrder();
        if ($order instanceof \Illuminate\Http\Response) {
            return $order;
        }

        if ($order) {
            $order->products()->detach();
            $order->delete();
            return response()->json(['message' => 'Current order canceled'], 200);
        }
    }
    function findCurrentOrder()
    {
        $token = auth()->getToken();
        if ($token) {
            if (!auth()->check()) {
                return response('Unauthorized.', 401);
            }
            else{
                $user = auth()->user();
                return $user->orders()->whereNull('date')->latest()->first();
            }
        } else {
            $guest_id = request()->cookie('guest_id');
            if ($guest_id) {
                return Order::where('guest_id', $guest_id)->whereNull('date')->latest()->first();
            }
        }
    }

}
