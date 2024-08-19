<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;

class ProductFilter extends AbstractFilter
{
    protected const TITLE = 'title';
    protected const CATEGORY_ID = 'category_id';
    protected const TAG_IDS = 'tag_ids';
    protected const PRICE_RANGE = 'price_range';
    protected function getCallbacks(): array
    {
        return [
            self::TITLE=>[$this, 'title'],
            self::CATEGORY_ID=>[$this, 'categoryId'],
            self::TAG_IDS=>[$this, 'tagIds'],
            self::PRICE_RANGE => [$this, 'priceRange'],
        ];
    }

    public function title(Builder $builder, $value)
    {
        $builder->where('title', 'like', "%{$value}%");
    }

    public function categoryId(Builder $builder, $value)
    {
        $builder->where('category_id', $value);
    }
    public function tagIds(Builder $builder, $value)
    {
        foreach ($value as $tagId) {
            $builder->whereHas('tags', function (Builder $query) use ($tagId) {
                $query->where('tags.id', $tagId);
            });
        }
    }
    public function priceRange(Builder $builder, $value)
    {
        if (isset($value['min'])) {
            $builder->where('price', '>=', $value['min']);
        }
        if (isset($value['max'])) {
            $builder->where('price', '<=', $value['max']);
        }
    }
}
