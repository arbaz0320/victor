<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FieldsBlockUpdateRequest extends FormRequest
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
            'contract_block_id' => ['required', 'integer'],
            'type' => ['required', 'string'],
            'mask' => ['required', 'string'],
            'label' => ['required', 'string'],
            'position' => ['required', 'integer'],
        ];
    }
}
