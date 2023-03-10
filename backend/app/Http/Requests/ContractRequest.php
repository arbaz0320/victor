<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class ContractRequest extends FormRequest
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
            'description' => ['required', 'string'],
            'text' => ['required', 'string'],
            'status' => ['sometimes'],
            'type_id' => ['required', 'integer', 'exists:contract_types,id'],
            'price' => ['required'],
            'presentation_path' => ['nullable', 'string'],
            // 'signatures_number' => ['required'],
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
