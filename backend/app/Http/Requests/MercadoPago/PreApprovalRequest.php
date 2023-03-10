<?php

namespace App\Http\Requests\MercadoPago;

use Illuminate\Foundation\Http\FormRequest;

class PreApprovalRequest extends FormRequest
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
            'transaction_amount'
        ];
    }
}
