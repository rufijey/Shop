<?php

namespace App\Services;

use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\CssSelector\Exception\InternalErrorException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class ReviewService
{
    public function getByProductId(int $productId)
    {
        return Review::where('product_id', $productId)->get();
    }

    public function create(array $data): AnonymousResourceCollection
    {
        try {
            if (!Auth::user()->reviews()->where('product_id', $data['product_id'])->exists()) {
                DB::beginTransaction();
                $reviews = Auth::user()->reviews()->create($data);
                $this->updateProductRating($data['product_id']);
                DB::commit();
                return ReviewResource::collection($reviews);
            }
            throw new BadRequestException('review already exists');
        } catch (\Exception $exception) {
            DB::rollBack();
            throw new InternalErrorException($exception->getMessage(),500, $exception);
        }
    }

    public function update(Review $review, array $data): Review
    {
        try {
            DB::beginTransaction();
            $review->update($data);
            $this->updateProductRating($review->product_id);
            DB::commit();
            return $review;
        } catch (\Exception $exception) {
            DB::rollBack();
            throw new InternalErrorException($exception->getMessage(),500, $exception);
        }
    }

    public function delete(Review $review): void
    {
        try {
            DB::beginTransaction();
            $productId = $review->product_id;
            $review->delete();
            $this->updateProductRating($productId);
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw new InternalErrorException($exception->getMessage(),500, $exception);
        }
    }

    private function updateProductRating(int $productId): void
    {
        $product = Product::findOrFail($productId);
        $rating = $product->reviews()->avg('rating');
        $product->rating = $rating;
        $product->save();
    }
}
