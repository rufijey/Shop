<?php

namespace App\Http\Controllers;

use App\Http\Filters\CharacteristicFilter;
use App\Http\Requests\Characteristic\FilterRequest;
use App\Http\Requests\Characteristic\StoreRequest;
use App\Http\Requests\Characteristic\UpdateRequest;
use App\Http\Resources\CharacteristicResource;
use App\Models\Characteristic;
use App\Models\CharacteristicType;
use Illuminate\Http\Request;

class CharacteristicController extends Controller
{
    public function index(FilterRequest $request)
    {
        $data = $request->validated();
        $filter = app()->make(CharacteristicFilter::class, ['queryParams' => array_filter($data)]);
        $characteristics = Characteristic::filter($filter)->get();
        return CharacteristicResource::collection($characteristics);
    }

    public function getGrouped(FilterRequest $request)
    {
        $data = $request->validated();
        $filter = app()->make(CharacteristicFilter::class, ['queryParams' => array_filter($data)]);
        $characteristics = Characteristic::filter($filter)->get();
        return $characteristics->groupBy(fn($item) => $item->type->id)
        ->map(fn($group) => [
            'type' => $group->first()->type->title,
            'characteristics' => CharacteristicResource::collection($group),
        ])
        ->values()
        ->toArray();
    }

    public function getByIds(Request $request)
    {
        $ids = $request->input('characteristic_ids');
        $characteristics = Characteristic::whereIn('id', $ids)->get();
        return new CharacteristicResource($characteristics);
    }

    public function show(Characteristic $characteristic)
    {
        return new CharacteristicResource($characteristic);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        $typeTitle = ucfirst(strtolower($data['type']));

        $type = CharacteristicType::firstOrCreate(['title' => $typeTitle]);

        $existingCharacteristic = Characteristic::where([
            'body' => $data['body'],
            'type_id' => $type->id,
        ])->first();

        if ($existingCharacteristic) {
            return response()->json([
                'message' => 'Characteristic already exists.',
                'characteristic' => new CharacteristicResource($existingCharacteristic),
            ]);
        }

        $data['type_id'] = $type->id;
        unset($data['type']);
        $characteristic = Characteristic::create($data);

        return new CharacteristicResource($characteristic);
    }

    public function update(Characteristic $characteristic, UpdateRequest $request)
    {
        $data = $request->validated();
        $typeTitle = ucfirst(strtolower($data['type']));

        $type = CharacteristicType::firstOrCreate(['title' => $typeTitle]);

        $existingCharacteristic = Characteristic::where([
            'body' => $data['body'],
            'type_id' => $type->id,
        ])->where('id', '!=', $characteristic->id)->exists();

        if ($existingCharacteristic) {
            return response()->json([
                'message' => 'Characteristic with this body and type already exists.',
            ]);
        }

        $data['type_id'] = $type->id;
        unset($data['type']);
        $characteristic->update($data);

        return new CharacteristicResource($characteristic);
    }

    public function destroy(Characteristic $characteristic)
    {
        $characteristic->delete();
        return response()->json(['message' => 'Characteristic deleted successfully.']);
    }
}
