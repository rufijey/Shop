<?php

namespace App\Http\Controllers;

use App\Http\Filters\CategoryFilter;
use App\Http\Requests\Category\FilterRequest;
use App\Http\Requests\Order\ChangeQuantityRequest;
use App\Http\Requests\Order\RemoveProductRequest;
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

    public function completed()
    {
        return $this->orderService->completed();
    }

    public function current()
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

    public function complete()
    {
        return $this->orderService->complete();
    }

    public function deleteCurrent()
    {
        return $this->orderService->deleteCurrent();
    }

    public function destroy(Order $order){
        $order->products()->detach();
        $order->delete();
    }
    public function changeQuantity(ChangeQuantityRequest $request){
        $data = $request->validated();
        return $this->orderService->changeQuantity($data['quantity'], $data['product_id']);

    }
}
