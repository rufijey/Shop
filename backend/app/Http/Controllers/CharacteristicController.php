<?php

namespace App\Http\Controllers;

use App\Http\Filters\CharacteristicFilter;
use App\Http\Requests\Characteristic\FilterRequest;
use App\Http\Requests\Characteristic\StoreRequest;
use App\Http\Requests\Characteristic\UpdateRequest;
use App\Http\Resources\CharacteristicResource;
use App\Models\Characteristic;
use App\Services\CharacteristicService;
use Illuminate\Http\Request;

class CharacteristicController extends Controller
{
    protected $service;

    public function __construct(CharacteristicService $service)
    {
        $this->service = $service;
    }

    public function index(FilterRequest $request)
    {
        $data = $request->validated();
        $filter = app()->make(CharacteristicFilter::class, ['queryParams' => array_filter($data)]);
        return $this->service->getAll($filter);
    }

    public function getGrouped(FilterRequest $request)
    {
        $data = $request->validated();
        $filter = app()->make(CharacteristicFilter::class, ['queryParams' => array_filter($data)]);
        return response()->json($this->service->getGrouped($filter));
    }

    public function getByIds(Request $request)
    {
        $ids = $request->input('characteristic_ids');
        return $this->service->getByIds($ids);
    }

    public function show(Characteristic $characteristic)
    {
        return new CharacteristicResource($characteristic);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        $result = $this->service->create($data);

        if ($result['exists']) {
            return response()->json([
                'message' => 'Characteristic already exists.',
                'characteristic' => $result['characteristic'],
            ]);
        }

        return $result['characteristic'];
    }

    public function update(Characteristic $characteristic, UpdateRequest $request)
    {
        $data = $request->validated();
        $result = $this->service->update($characteristic, $data);

        if ($result['exists']) {
            return response()->json([
                'message' => 'Characteristic with this body and type already exists.',
            ]);
        }

        return $result['characteristic'];
    }

    public function destroy(Characteristic $characteristic)
    {
        return $this->service->delete($characteristic);
    }
}
