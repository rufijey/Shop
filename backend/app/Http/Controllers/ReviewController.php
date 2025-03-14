<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\IndexRequest;
use App\Http\Requests\Review\StoreRequest;
use App\Http\Requests\Review\UpdateRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Services\ReviewService;
use Symfony\Component\CssSelector\Exception\InternalErrorException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

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
        $this->service->create($data);

    }

    public function update(UpdateRequest $request, Review $review)
    {
        $data = $request->validated();

        $this->service->update($review, $data);

    }

    public function destroy(Review $review)
    {
        $this->service->delete($review);

    }
}
