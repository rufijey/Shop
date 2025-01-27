<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\IndexRequest;
use App\Http\Requests\Review\StoreRequest;
use App\Http\Requests\Review\UpdateRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    protected $service;

    public function __construct(ReviewService $service)
    {
        $this->service = $service;
    }

    public function index(IndexRequest $request)
    {
        $data = $request->validated();
        $reviews = $this->service->index($data['product_id']);
        return ReviewResource::collection($reviews);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        try {
            $review = $this->service->create($data);

            if (!$review) {
                return response()->json(['message' => 'Review already exists.'], 400);
            }

            return response()->json(['message' => 'Review created successfully.'], 201);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function update(UpdateRequest $request, Review $review)
    {
        $data = $request->validated();

        try {
            $this->service->update($review, $data);
            return response()->json(['message' => 'Review updated successfully.'], 201);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function destroy(Review $review)
    {
        try {
            $this->service->delete($review);
            return response()->json(['message' => 'Review deleted successfully.'], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
