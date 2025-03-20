<?php

namespace App\Http\Controllers;

use App\Http\Filters\CategoryFilter;
use App\Http\Requests\Category\StoreRequest;
use App\Http\Requests\Category\FilterRequest;
use App\Http\Requests\Category\UpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use function PHPUnit\Framework\throwException;

class CategoryController extends Controller
{
    public function index(FilterRequest $request): AnonymousResourceCollection
    {
        $data = $request->validated();
        $filter = app()->make(CategoryFilter::class, ['queryParams' => array_filter($data)]);
        $categories = Category::filter($filter)->get();
        return CategoryResource::collection($categories);
    }

    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    public function store(StoreRequest $request): void
    {
        $data = $request->validated();
        $category = Category::firstOrNew(['title' => $data['title']], $data);
        if ($category->exists) {
           throw new ConflictHttpException('category already exists');
        } else {
            Category::Create($data);
        }
    }

    public function update(Category $category, UpdateRequest $request): void
    {
        $data = $request->validated();
        $categoryExists = Category::where('title', $data['title'])->exists();
        if ($categoryExists) {
            throw new ConflictHttpException('category already exists');
        } else {
            $category->update($data);
        }
    }

    public function destroy(Category $category): void
    {
        $category->delete();
    }
}
