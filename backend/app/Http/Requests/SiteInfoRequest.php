<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class SiteInfoRequest extends FormRequest
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
            'banner_title' => ['nullable', 'string'],
            'banner_text' => ['nullable', 'string'],
            'section1_title' => ['nullable', 'string'],
            'section1_text' => ['nullable', 'string'],
            'section2_title' => ['nullable', 'string'],
            'section2_text' => ['nullable', 'string'],
            'section3_title' => ['nullable', 'string'],
            'section3_text' => ['nullable', 'string'],
            'link_facebook' => ['nullable', 'string'],
            'link_instagram' => ['nullable', 'string'],
            'link_linkedin' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'phone1' => ['nullable', 'string'],
            'phone2' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'counters_1' => ['nullable', 'integer'],
            'counters_2' => ['nullable', 'integer'],
            'counters_3' => ['nullable', 'integer'],
            'counters_4' => ['nullable', 'integer'],
            'term_text' => ['nullable', 'string'],
            'price_question' => ['nullable'],

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
