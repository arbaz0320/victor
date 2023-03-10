<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class PlanRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'recommended' => ['sometimes'],
            'status'      => ['sometimes'],
            'price_month' => ['required', 'numeric'],
            'price_year' => ['required', 'numeric'],
            'percentage_discount_questions' => ['required', 'numeric'],
            'percentage_discount_contracts' => ['required', 'numeric'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error'   => true,
            'message' => $validator->errors()->first()
        ], Response::HTTP_BAD_REQUEST));
    }
}
