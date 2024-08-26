<?php

namespace App\Http\Controllers;

use App\Http\Filters\TagFilter;
use App\Http\Requests\Tag\FilterRequest;
use App\Http\Requests\Tag\StoreRequest;
use App\Http\Requests\Tag\UpdateRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(FilterRequest $request)
    {
        $data = $request->validated();
        $filter = app()->make(TagFilter::class, ['queryParams' => array_filter($data)]);
        $tags = Tag::filter($filter)->get();
        return TagResource::collection($tags);
    }

    public function show(Tag $tag)
    {
        return new TagResource($tag);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        $tag = Tag::firstOrNew(['title' => $data['title']], $data);
        if ($tag->exists) {
            return response()->json([
                'message' => 'Tag already exists.',
                'tag' => $tag
            ]);
        } else {
            Tag::Create($data);
        }
    }

    public function update(Tag $tag, UpdateRequest $request)
    {
        $data = $request->validated();
        $categoryExists = Tag::where('title', $data['title'])->exists();
        if ($categoryExists) {
            return response()->json([
                'message' => 'Tag already exists.',
                'tag' => $tag
            ]);
        } else {
            $tag->update($data);
        }
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();
    }
}
