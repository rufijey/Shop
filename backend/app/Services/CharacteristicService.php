<?php

namespace App\Services;

use App\Http\Resources\CharacteristicResource;
use App\Models\Characteristic;
use App\Models\CharacteristicType;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class CharacteristicService
{
    public function getAll($filter)
    {
        $characteristics = Characteristic::filter($filter)->get();
        return CharacteristicResource::collection($characteristics);
    }

    public function getGrouped($filter): array
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

    public function getByIds(array $ids): AnonymousResourceCollection
    {
        $characteristics = Characteristic::whereIn('id', $ids)->get();
        return CharacteristicResource::collection($characteristics);
    }

    public function create(array $data): CharacteristicResource
    {
        $typeTitle = ucfirst(strtolower($data['type']));
        $type = CharacteristicType::firstOrCreate(['title' => $typeTitle]);

        $existingCharacteristic = Characteristic::where([
            'body' => $data['body'],
            'type_id' => $type->id,
        ])->first();

        if ($existingCharacteristic) {
           throw new ConflictHttpException("Characteristic already exists.");
        }

        $data['type_id'] = $type->id;
        unset($data['type']);
        $characteristic = Characteristic::create($data);

        return new CharacteristicResource($characteristic);
    }

    public function update(Characteristic $characteristic, array $data): CharacteristicResource
    {
        $typeTitle = ucfirst(strtolower($data['type']));
        $type = CharacteristicType::firstOrCreate(['title' => $typeTitle]);

        $existingCharacteristic = Characteristic::where([
            'body' => $data['body'],
            'type_id' => $type->id,
        ])->where('id', '!=', $characteristic->id)->exists();

        if ($existingCharacteristic) {
            throw new ConflictHttpException("Characteristic already exists.");
        }

        $data['type_id'] = $type->id;
        unset($data['type']);
        $characteristic->update($data);

        return new CharacteristicResource($characteristic);
    }

    public function delete(Characteristic $characteristic): void
    {
        $characteristic->delete();
    }
}
