<?php

namespace App\Services;

use App\Http\Resources\ProductResource;
use App\Models\Image;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function store($data)
    {
        try {
            DB::beginTransaction();
            $images = $data['images'];
            unset($data['images']);
            if (isset($data['tag_ids'])) {
                $tag_ids = $data['tag_ids'];
                unset($data['tag_ids']);
                $product = Product::Create($data);
                $product->tags()->attach($tag_ids);
            } else {
                $product = Product::Create($data);
            }

            $this->storeImages($product, $images);
            DB::commit();
            return new ProductResource($product);
        } catch (\Exception $exception) {
            DB::rollBack();
            return $exception->getMessage();
        }
    }

    public function update($product, $data)
    {
        try {
            DB::beginTransaction();
            $tag_ids = $data['tag_ids'] ?? [];
            unset($data['tag_ids']);

            if (!empty($tag_ids)) {
                $product->tags()->sync($tag_ids);
            } else {
                $product->tags()->sync([]);
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
            return $exception->getMessage();
        }
    }

    public function delete($product)
    {
        $this->deleteImages($product);
        $product->delete();
    }

    protected function deleteImages($product)
    {
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }
    }

    protected function deleteImagesByIds($images_ids_for_delete)
    {
        foreach ($images_ids_for_delete as $image_id) {
            $image = Image::find($image_id);
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }
    }

    protected function storeImages($product, $images)
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
