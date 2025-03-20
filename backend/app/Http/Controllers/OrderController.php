<?php

namespace App\Http\Controllers;

use App\Http\Filters\CategoryFilter;
use App\Http\Requests\Category\FilterRequest;
use App\Http\Requests\Order\ChangeQuantityRequest;
use App\Http\Requests\Order\StoreRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\OrderResource;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    private $orderService;
    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }
    public function index()
    {
        return $this->orderService->index();
    }

    public function getCompletedOrders()
    {
        return $this->orderService->completed();
    }

    public function getCurrentOrder()
    {
        return $this->orderService->current();
    }

    public function addProduct(StoreRequest $request)
    {
        $data = $request->validated();
        return $this->orderService->addProduct($data);
    }

    public function removeProduct($product_id)
    {
        return $this->orderService->removeProduct($product_id);
    }

    public function completeOrder()
    {
        return $this->orderService->complete();
    }

    public function deleteCurrentOrder()
    {
        return $this->orderService->deleteCurrent();
    }

    public function destroy(Order $order): void
    {
        $order->products()->detach();
        $order->delete();
    }
    public function changeQuantity(ChangeQuantityRequest $request)
    {
        $data = $request->validated();
        return $this->orderService->changeQuantity($data['quantity'], $data['product_id']);

    }
}
