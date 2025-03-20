<?php

namespace App\Services;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class OrderService
{
    public function getUserOrders(): AnonymousResourceCollection
    {
        $user = auth()->user();
        return OrderResource::collection($user->orders);
    }

    public function completed(): AnonymousResourceCollection
    {
        $user = auth()->user();
        $orders = $user->orders()->whereNotNull('date')->get();
        return OrderResource::collection($orders);
    }

    public function current()
    {
        $order = $this->findCurrentOrder();
        if ($order) {
            return new OrderResource($order);
        }
    }

    public function addProduct($data): OrderResource
    {
        $token = auth()->getToken();
        if ($token) {
            if (!auth()->check()) {
                throw new UnauthorizedException('unauthenticated');
            }

            $user = auth()->user();
            $order = $user->orders()->whereNull('date')->latest()->first();
            if (!$order) {
                $order = $user->orders()->create();
            }
        } else {
            $guest_id = request()->cookie('guest_id');
            if ($guest_id) {
                $order = Order::where('guest_id', $guest_id)->whereNull('date')->latest()->first();
                if (!$order) {
                    $order = Order::create(['guest_id' => $guest_id]);
                }
            }
        }

        $order->products()->syncWithoutDetaching([
            $data['product_id'] => ['quantity' => 1]
        ]);

        return new OrderResource($order);
    }

    public function removeProduct($product_id): void
    {
        $order = $this->findCurrentOrder();
        $order->products()->detach($product_id);
    }

    public function complete()
    {
        $user = auth()->user();
        $order = $user->orders()->whereNull('date')->first();
        if ($order) {
            $order->update(['date' => today()]);
        }
    }

    public function changeQuantity($quantity, $product_id):ResponseFactory
    {
        $order = $this->findCurrentOrder();
        if (!$order) {
            throw new NotFoundHttpException('order not found');
        }
        if ($order->products()->where('product_id', $product_id)->exists()) {
            $order->products()->updateExistingPivot($product_id, ['quantity' => $quantity]);
            $quantity = $order->products()->where('product_id', $product_id)->first()->pivot->quantity;
            $total_price = $order->products()->sum(DB::raw('products.price * order_product.quantity'));
            return response(['quantity' => $quantity, 'total_price' => $total_price], 200);
        }
        throw new BadRequestException('no product in order');
    }

    public function deleteCurrent(): void
    {
        $order = $this->findCurrentOrder();

        if ($order) {
            $order->products()->detach();
            $order->delete();
        }
    }

    public function findCurrentOrder(): Order|null
    {
        $token = auth()->getToken();
        if ($token) {
            if (!auth()->check()) {
                throw new UnauthorizedException('unauthorized');
            } else {
                $user = auth()->user();
                return $user->orders()->whereNull('date')->latest()->first();
            }
        }
        $guest_id = request()->cookie('guest_id');
        if ($guest_id) {
            return Order::where('guest_id', $guest_id)->whereNull('date')->latest()->first();
        }
        throw new BadRequestHttpException('unauthorized');

    }

    public function syncOrders(): void
    {
        try {
            DB::beginTransaction();

            $guest_id = request()->cookie('guest_id');
            $guestOrder = Order::where('guest_id', $guest_id)->whereNull('date')->first();
            $userOrder = auth()->user()->orders()->whereNull('date')->first();
            if ($guestOrder) {
                if (!$userOrder) {
                    $guestOrder->update([
                        'user_id' => auth()->user()->id,
                        'guest_id' => null
                    ]);
                } else {
                    $products = $guestOrder->products;

                    foreach ($products as $product) {
                        $userProduct = $userOrder->products()->where('product_id', $product->id)->first();
                        $userOrder->products()->syncWithoutDetaching($product->id, ['quantity' => $product->pivot->quantity]);
                    }

                    $guestOrder->products()->detach();
                }
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

    }


}
