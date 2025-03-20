<?php

namespace App\Http\Controllers;

use App\Http\Filters\CharacteristicFilter;
use App\Http\Requests\Characteristic\FilterRequest;
use App\Http\Requests\Characteristic\StoreRequest;
use App\Http\Requests\Characteristic\UpdateRequest;
use App\Http\Resources\CharacteristicResource;
use App\Models\Characteristic;
use App\Services\CharacteristicService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CharacteristicController extends Controller
{
    protected $service;

    public function __construct(CharacteristicService $service)
    {
        $this->service = $service;
    }

    public function index(FilterRequest $request): AnonymousResourceCollection
    {
        $data = $request->validated();
        $filter = app()->make(CharacteristicFilter::class, ['queryParams' => array_filter($data)]);
        return $this->service->getAll($filter);
    }

    public function getGrouped(FilterRequest $request): JsonResponse
    {
        $data = $request->validated();
        $filter = app()->make(CharacteristicFilter::class, ['queryParams' => array_filter($data)]);
        return response()->json($this->service->getGrouped($filter));
    }

    public function getByIds(Request $request): AnonymousResourceCollection
    {
        $ids = $request->input('characteristic_ids');
        return $this->service->getByIds($ids);
    }

    public function show(Characteristic $characteristic): CharacteristicResource
    {
        return new CharacteristicResource($characteristic);
    }

    public function store(StoreRequest $request): CharacteristicResource
    {
        $data = $request->validated();
        $result = $this->service->create($data);

        return $result;
    }

    public function update(Characteristic $characteristic, UpdateRequest $request): CharacteristicResource
    {
        $data = $request->validated();
        $result = $this->service->update($characteristic, $data);

        return $result;
    }

    public function destroy(Characteristic $characteristic): void
    {
        $this->service->delete($characteristic);
    }
}
