<?php

namespace App\Services;

use App\Http\Resources\CharacteristicResource;
use App\Models\Characteristic;
use App\Models\CharacteristicType;

class CharacteristicService
{
    public function getAll($filter)
    {
        $characteristics = Characteristic::filter($filter)->get();
        return CharacteristicResource::collection($characteristics);
    }

    public function getGrouped($filter)
    {
        $characteristics = Characteristic::filter($filter)->get();

        return $characteristics->groupBy(fn($item) => $item->type->id)
            ->map(fn($group) => [
                'type' => $group->first()->type->title,
                'characteristics' => CharacteristicResource::collection($group),
            ])
            ->values()
            ->toArray();
    }

    public function getByIds(array $ids)
    {
        $characteristics = Characteristic::whereIn('id', $ids)->get();
        return CharacteristicResource::collection($characteristics);
    }

    public function create(array $data)
    {
        $typeTitle = ucfirst(strtolower($data['type']));
        $type = CharacteristicType::firstOrCreate(['title' => $typeTitle]);

        $existingCharacteristic = Characteristic::where([
            'body' => $data['body'],
            'type_id' => $type->id,
        ])->first();

        if ($existingCharacteristic) {
            return [
                'exists' => true,
                'characteristic' => new CharacteristicResource($existingCharacteristic),
            ];
        }

        $data['type_id'] = $type->id;
        unset($data['type']);
        $characteristic = Characteristic::create($data);

        return [
            'exists' => false,
            'characteristic' => new CharacteristicResource($characteristic),
        ];
    }

    public function update(Characteristic $characteristic, array $data)
    {
        $typeTitle = ucfirst(strtolower($data['type']));
        $type = CharacteristicType::firstOrCreate(['title' => $typeTitle]);

        $existingCharacteristic = Characteristic::where([
            'body' => $data['body'],
            'type_id' => $type->id,
        ])->where('id', '!=', $characteristic->id)->exists();

        if ($existingCharacteristic) {
            return [
                'exists' => true,
            ];
        }

        $data['type_id'] = $type->id;
        unset($data['type']);
        $characteristic->update($data);

        return [
            'exists' => false,
            'characteristic' => new CharacteristicResource($characteristic),
        ];
    }

    public function delete(Characteristic $characteristic)
    {
        $characteristic->delete();
        return response()->json(['message' => 'Characteristic deleted successfully.']);
    }
}
