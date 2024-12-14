<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;

class CharacteristicFilter extends AbstractFilter
{
    protected const SEARCH = 'search';
    protected function getCallbacks(): array
    {
        return [
            self::SEARCH=>[$this, 'search'],
        ];
    }

    public function search(Builder $builder, $value)
    {
        $searchTerms = explode(' ', $value);

        $builder->where(function ($query) use ($searchTerms) {
            foreach ($searchTerms as $term) {
                $this->applySearchTerm($query, $term);
            }
        });
    }
    protected function applySearchTerm(Builder $query, string $term)
    {
        $query->where(function ($nestedQuery) use ($term) {
            $this->filterByBody($nestedQuery, $term);
            $this->filterByTypeTitle($nestedQuery, $term);
        });
    }

    protected function filterByBody(Builder $query, string $term)
    {
        $query->orWhere('body', 'like', "%{$term}%");
    }


    protected function filterByTypeTitle(Builder $query, string $term)
    {
        $query->orWhereHas('type', function ($typeQuery) use ($term) {
            $typeQuery->where('title', 'like', "%{$term}%");
        });
    }
}
