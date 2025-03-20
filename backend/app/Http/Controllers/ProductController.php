<?php

namespace App\Http\Controllers;

use App\Http\Filters\ProductFilter;
use App\Http\Requests\Product\FilterRequest;
use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\FiltersResource;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(FilterRequest $request): JsonResponse
    {
        $data = $request->validated();
        return $this->productService->getFiltered($data);
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product);
    }

    public function store(StoreRequest $request): ProductResource
    {
        $data = $request->validated();
        return $this->productService->store($data);
    }

    public function update(Product $product, UpdateRequest $request): ProductResource
    {
        $data = $request->validated();
        return $this->productService->update($product, $data);
    }

    public function destroy(Product $product): void
    {
        $this->productService->delete($product);
    }

    public function getMaxPrice(): JsonResponse
    {
        $maxPrice = Product::max('price');
        return response()->json(['max_price' => $maxPrice]);
    }

    public function getFilters(): FiltersResource
    {
        return new FiltersResource(null);
    }
}

