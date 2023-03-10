<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class CouponStoreRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'value' => ['required', 'numeric'],
            'discount_type' => ['required', 'integer'],
            'expire_at' => ['required', 'after:'.Carbon::yesterday()],
        ];
    }

    public function messages()
    {
        return [
            'expire_at.after' => 'A data de validade do cupom deve ser a partir de hoje'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(
            [
                'error' => true,
                'message' => $validator->errors()->first()
            ], Response::HTTP_BAD_REQUEST)
        );
    }
}
