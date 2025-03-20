<?php

namespace App\Http\Controllers;

use App\Http\Requests\Filter\GetByIdsRequest;
use App\Http\Requests\User\ResetPasswordRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\VerifyRequest;
use App\Http\Resources\CharacteristicResource;
use App\Http\Resources\FiltersResource;
use App\Http\Resources\FiltersResourceNoGroup;
use App\Http\Resources\SelectedFiltersResource;
use App\Models\Category;
use App\Models\Characteristic;
use App\Models\Product;
use App\Models\User;
use App\Notifications\CustomResetPassword;
use App\Notifications\CustomVerifyEmail;
use App\Services\AccountService;
use App\Services\AuthService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class FilterController extends Controller
{
    public function index(): FiltersResource
    {
        $groupedCharacteristics = Characteristic::all()
            ->groupBy(fn($item) => $item->type->id);

        $categories = Category::all();
        $maxPrice = Product::max('price');

        return new FiltersResource([
            'grouped_characteristics' => $groupedCharacteristics,
            'categories' => $categories,
            'max_price' => $maxPrice,
        ]);
    }

    public function noGroup(): FiltersResourceNoGroup
    {
        $characteristics = Characteristic::all();

        $categories = Category::all();
        $maxPrice = Product::max('price');


        return new FiltersResourceNoGroup([
            'characteristics' => $characteristics,
            'categories' => $categories,
            'max_price' => $maxPrice,
        ]);

    }
    public function getByIds(GetByIdsRequest $request): SelectedFiltersResource
    {
        $data = $request->validated();
        $characteristics = isset($data['characteristic_ids']) ?
            Characteristic::whereIn('id', $data['characteristic_ids'])->get() : null;
        $category = isset($data['category_id']) ? Category::find($data['category_id']) : null;
        return new SelectedFiltersResource([
            'characteristics' => $characteristics,
            'category' => $category
        ]);
    }
}
