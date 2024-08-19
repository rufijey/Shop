<?php

namespace App\Http\Controllers;

use App\Http\Filters\CategoryFilter;
use App\Http\Requests\Category\CategoryRequest;
use App\Http\Requests\Category\FilterRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(FilterRequest $request){
        $data = $request->validated();
        $filter = app()->make(CategoryFilter::class, ['queryParams' => array_filter($data)]);
        $categories = Category::filter($filter)->get();
        return CategoryResource::collection($categories);
    }
    public function show(Category $category){
        return new CategoryResource($category);
    }
    public function store(CategoryRequest $request){
        $data = $request->validated();
        $category = Category::firstOrNew(['title' => $data['title']], $data);
        if ($category->exists) {
            return response()->json([
                'message' => 'Category already exists.',
                'category' => $category
            ]);
        }
        else{
            Category::Create($data);
        }
    }
    public function update(Category $category, CategoryRequest $request){
        $data = $request->validated();
        $categoryExists = Category::where('title', $data['title'])->exists();
        if ($categoryExists) {
            return response()->json([
                'message' => 'Category already exists.',
                'category' => $category
            ]);
        }
        else{
            $category->update($data);
        }
    }
    public function destroy(Category $category){
        $category->delete();
    }
}
