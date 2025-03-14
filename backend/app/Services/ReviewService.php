<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\CssSelector\Exception\InternalErrorException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class ReviewService
{
    public function index(int $productId)
    {
        return Review::where('product_id', $productId)->get();
    }

    public function create(array $data)
    {
        try {
            if (!Auth::user()->reviews()->where('product_id', $data['product_id'])->exists()) {
                DB::beginTransaction();
                $review = Auth::user()->reviews()->create($data);
                $this->updateProductRating($data['product_id']);
                DB::commit();
                return $review;
            }
            throw new BadRequestException('review already exists');
        } catch (\Exception $exception) {
            DB::rollBack();
            throw new InternalErrorException($exception->getMessage(),500, $exception);
        }
    }

    public function update(Review $review, array $data)
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

    public function delete(Review $review)
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

    private function updateProductRating(int $productId)
    {
        $product = Product::findOrFail($productId);
        $rating = $product->reviews()->avg('rating');
        $product->rating = $rating;
        $product->save();
    }
}
