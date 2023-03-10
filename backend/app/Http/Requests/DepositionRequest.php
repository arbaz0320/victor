<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class DepositionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'author' => ['required', 'string'],
            'description' => ['required', 'string'],
            'role' => ['required', 'string'],
            'image' => ['sometimes', 'image', 'mimes:jpeg,png,jpg', 'max: 2048'] // 2 MB
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json(
                [
                    'error' => true,
                    'message' => $validator->errors()->first()
                ],
                Response::HTTP_BAD_REQUEST
            )
        );
    }
}
