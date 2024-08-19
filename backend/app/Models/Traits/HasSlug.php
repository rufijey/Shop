<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    public function resolveRouteBindingQuery($query, $value, $field = null)
    {
        $slugParts = explode('-', $value);
        $encodedId = end($slugParts);
        $id = base64_decode($encodedId);
        return $query->where($field ?? $this->getRouteKeyName(), $id);
    }

    public function getSlugAttribute(){
        $encodedId = base64_encode($this->id);
        return Str::slug($this->title) . '-' . $encodedId;
    }
}
