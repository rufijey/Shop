<?php

namespace App\Http\Controllers;

use App\Http\Filters\CategoryFilter;
use App\Http\Requests\Category\FilterRequest;
use App\Http\Requests\Order\RemoveProductRequest;
use App\Http\Requests\Order\StoreRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\OrderResource;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
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
        $user = auth()->user();
        $order = $user->orders()->whereNull('date')->first();
        if ($order) {
            return new OrderResource($order);
        }
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        $user = auth()->user();
        $order = $user->orders()->whereNull('date')->first();

        if (!$order) {
            $order = $user->orders()->create();
        }

        $order->products()->syncWithoutDetaching([
            $data['product_id'] => ['quantity' => DB::raw('quantity + 1')]
        ]);

        return new OrderResource($order);
    }

    public function removeProduct($product_id)
    {
        $user = auth()->user();
        $order = $user->orders()->whereNull('date')->first();
        $order->products()->detach($product_id);

        return response()->json(['message' => 'Product removed from order'], 200);
    }

    public function complete()
    {
        $user = auth()->user();
        $order = $user->orders()->whereNull('date')->first();
        if ($order) {
            $order->update(['date' => today()]);
            return response()->json(['message' => 'Order completed'], 200);
        }
    }

    public function cancel()
    {
        $user = auth()->user();
        $order = $user->orders()->whereNull('date')->first();
        if ($order) {
            $order->products()->detach();
            $order->delete();
            return response()->json(['message' => 'Order canceled'], 200);
        }
    }

    public function destroy(Order $order){
        $order->products()->detach();
        $order->delete();
    }
}
