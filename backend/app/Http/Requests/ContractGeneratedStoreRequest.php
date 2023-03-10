<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContractGeneratedStoreRequest extends FormRequest
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
            'content' => ['required', 'string'],
            'order_id' => ['required', 'integer'],
            'answers' => ['nullable', 'array'],
            'blockAnswers' => ['nullable', 'array'],
        ];
    }
}
