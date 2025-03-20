<?php

namespace App\Services;

use App\Http\Filters\ProductFilter;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Image;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getFiltered($data): JsonResponse
    {
        $page = $data['page'] ?? 1;
        $perPage = $data['per_page'] ?? 10;
        unset($data['page']);
        unset($data['per_page']);
        $filter = app()->make(ProductFilter::class, ['queryParams' => array_filter($data)]);
        $products = Product::filter($filter)->paginate($perPage, ['*'], 'page', $page);
        return ProductListResource::collection($products->items())
            ->response()->header('x-total-count', $products->total());
    }
    public function store($data): ProductResource
    {
        try {
            DB::beginTransaction();
            $images = $data['images'];
            unset($data['images']);
            if (isset($data['characteristic_ids'])) {
                $characteristic_ids = $data['characteristic_ids'];
                unset($data['characteristic_ids']);
                $product = Product::Create($data);
                $product->characteristics()->attach($characteristic_ids);
            } else {
                $product = Product::Create($data);
            }

            $this->storeImages($product, $images);
            DB::commit();
            return new ProductResource($product);
        } catch (\Exception $exception) {
            DB::rollBack();
           throw $exception;
        }
    }

    public function update($product, $data): ProductResource
    {
        try {
            DB::beginTransaction();
            $characteristic_ids = $data['characteristic_ids'] ?? [];
            unset($data['characteristic_ids']);

            if (!empty($characteristic_ids)) {
                $product->characteristics()->sync($characteristic_ids);
            } else {
                $product->characteristics()->sync([]);
            }
            if (isset($data['images'])) {
                $this->storeImages($product, $data['images']);
            }
            if (isset($data['image_ids_for_delete'])) {
                $this->deleteImagesByIds($data['image_ids_for_delete']);
            }
            unset($data['images']);
            unset($data['image_ids_for_delete']);
            $product->update($data);
            DB::commit();

            return new ProductResource($product->fresh());

        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
    }

    public function delete($product): void
    {
        $this->deleteImages($product);
        $product->delete();
    }

    protected function deleteImages($product): void
    {
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }
    }

    protected function deleteImagesByIds($images_ids_for_delete): void
    {
        foreach ($images_ids_for_delete as $image_id) {
            $image = Image::find($image_id);
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }
    }

    protected function storeImages($product, $images): void
    {
        foreach ($images as $image) {
            $name = md5(Carbon::now() . '_' . $image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
            $filePath = Storage::disk('public')->putFileAs('/images', $image, $name);
            Image::create([
                'product_id' => $product->id,
                'path' => $filePath,
                'url' => url('storage/' . $filePath)
            ]);
        }
    }
}
