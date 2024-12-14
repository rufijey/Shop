<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;

class ProductFilter extends AbstractFilter
{
    protected const SEARCH = 'search';
    protected const CATEGORY_ID = 'category_id';
    protected const CHARACTERISTIC_IDS = 'characteristic_ids';
    protected const PRICE_RANGE = 'price_range';
    protected const SORT_BY = 'sort_by';
    protected function getCallbacks(): array
    {
        return [
            self::SEARCH=>[$this, 'search'],
            self::CATEGORY_ID=>[$this, 'categoryId'],
            self::CHARACTERISTIC_IDS=>[$this, 'characteristicIds'],
            self::PRICE_RANGE => [$this, 'priceRange'],
            self::SORT_BY => [$this, 'sortBy'],
        ];
    }

    public function search(Builder $builder, $value)
    {
        $builder->whereRaw("MATCH(title, description) AGAINST(? IN BOOLEAN MODE)", ["{$value}*"]);
    }

    public function categoryId(Builder $builder, $value)
    {
        $builder->where('category_id', $value);
    }
    public function characteristicIds(Builder $builder, $value)
    {
        foreach ($value as $characteristicId) {
            $builder->whereHas('characteristics', function (Builder $query) use ($characteristicId) {
                $query->where('characteristics.id', $characteristicId);
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

    public function sortBy(Builder $builder, $value)
    {
        if ($value) {
            $field = $value['field'] ?? 'created_at';
            $direction = $value['direction'] ?? 'asc';
            $builder->orderBy($field, $direction);
        }
    }

}
