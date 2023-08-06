I wanted to share a simple search helper trait that I had to write to clean up some search code recently, in the hopes that it may be useful and also that it may help some newer laravel developers who are trying to understand how to write cleaner code.

```php
<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

/**
 * Used for simple api search
 *
 * Expected shape of  search would be
 *
 * search: {
 *      relation1: {
 *          relation2: {
 *              attr: 'value'
 *          }
 *      }
 * }
 *
 * handles multiple levels of nesting as long as the relations are loaded
 * eg. Model::with('relation1.relation2')->...
 */
trait NestedRelationSearch
{

    /**
     * used for simple controller search
     *
     * example:
     * ...
     * ->when(
     *      request('search'),
     *      fn (Builder $query) => $this->search($query)
     * )
     * ...
     *
     * @param Builder $query
     * @return Builder
     */
    private function search(Builder $query): Builder
    {
        $search = Arr::dot(
            json_decode(request('search'), true)
        );

        $search = collect($search)->filter(fn ($item) => $item != null);

        foreach ($search as $attribute => $searchTerm) {
            $query->when(
                str_contains($attribute, '.'),
                function (Builder $query) use ($attribute, $searchTerm) {
                    $bits = explode('.', $attribute);
                    $relationAttribute = array_pop($bits);
                    $relationName = implode('.', $bits);

                    $query->whereHas($relationName, function (Builder $query) use ($relationAttribute, $searchTerm) {
                        $query->where($relationAttribute, 'LIKE', "%{$searchTerm}%");
                    });
                },
                function (Builder $query) use ($attribute, $searchTerm) {
                    $query->where($attribute, 'LIKE', "%{$searchTerm}%");
                }
            );
        }

        return $query;
    }
}
```
