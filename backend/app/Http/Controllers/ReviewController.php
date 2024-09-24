<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\IndexRequest;
use App\Http\Requests\Review\StoreRequest;
use App\Http\Requests\Review\UpdateRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function index(IndexRequest $request)
    {
        $data = $request->validated();
        $reviews = Review::where('product_id', $data['product_id'])->get();
        return ReviewResource::collection($reviews);
    }

    public function show()
    {
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        try {
            if (!auth()->user()->reviews()->where('product_id', $data['product_id'])->exists()) {
                DB::beginTransaction();
                auth()->user()->reviews()->create($data);
                $product = Product::find($data['product_id']);
                $rating = $product->reviews()->avg('rating');
                $product->rating = $rating;
                $product->save();
                DB::commit();
                return response('review created', 201);
            }
        }catch (\Exception $exception){
            DB::rollBack();
            return response($exception->getMessage(), 500);
        }
    }

    public function update(UpdateRequest $request, Review $review)
    {
        $data = $request->validated();
        try {
            DB::beginTransaction();
            $review->update($data);
            $product = $review->product;
            $rating = $product->reviews()->avg('rating');
            $product->rating = $rating;
            $product->save();
            DB::commit();
            return response('review updated', 201);
        }catch (\Exception $exception){
            DB::rollBack();
            return response($exception->getMessage(), 500);
        }

    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response('review deleted', 200);
    }
}
