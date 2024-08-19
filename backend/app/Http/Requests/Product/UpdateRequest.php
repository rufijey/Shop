<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'=>'required|string',
            'description'=>'required|string',
            'price'=>'required|decimal:0,2',
            'quantity'=>'required|int',
            'category_id' => 'required|int',
            'tag_ids'=>'array',
            'images' => 'array',
            'image_ids_for_delete' => 'array',
        ];
    }
}
