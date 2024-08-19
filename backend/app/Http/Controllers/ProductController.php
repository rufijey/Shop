<?php

namespace App\Http\Controllers;

use App\Http\Filters\ProductFilter;
use App\Http\Requests\Product\FilterRequest;
use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private $productService;
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    public function index(FilterRequest $request){
        $data = $request->validated();
        $page = $data['page'] ?? 1;
        $perPage = $data['per_page'] ?? 10;
        unset($data['page']);
        unset($data['per_page']);
        $filter = app()->make(ProductFilter::class, ['queryParams' => array_filter($data)]);
        $products = Product::filter($filter)->paginate($perPage, ['*'], 'page', $page);
        return ProductResource::collection($products->items())
            ->response()->header('x-total-count', $products->total());
    }
    public function show(Product $product){
        return new ProductResource($product);
    }
    public function store(StoreRequest $request){
        $data = $request->validated();
        return $this->productService->store($data);
    }
    public function update(Product $product, UpdateRequest $request){
        $data = $request->validated();
        return $this->productService->update($product, $data);
    }
    public function destroy(Product $product){
        $this->productService->delete($product);
    }
}
