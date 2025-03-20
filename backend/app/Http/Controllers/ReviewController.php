<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\IndexRequest;
use App\Http\Requests\Review\StoreRequest;
use App\Http\Requests\Review\UpdateRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\CssSelector\Exception\InternalErrorException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class ReviewController extends Controller
{
    protected ReviewService $reviewService;

    public function __construct(ReviewService $service)
    {
        $this->reviewService = $service;
    }

    public function index(IndexRequest $request): AnonymousResourceCollection
    {
        $data = $request->validated();
        return $this->reviewService->getByProductId($data['product_id']);
    }

    public function store(StoreRequest $request): void
    {
        $data = $request->validated();
        $this->reviewService->create($data);
    }

    public function update(UpdateRequest $request, Review $review): void
    {
        $data = $request->validated();

        $this->reviewService->update($review, $data);

    }

    public function destroy(Review $review): void
    {
        $this->reviewService->delete($review);

    }
}
