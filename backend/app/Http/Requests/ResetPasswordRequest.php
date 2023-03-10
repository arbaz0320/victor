<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class ResetPasswordRequest extends FormRequest
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
            'email' => ['required', 'email', 'exists:users']
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'O e-mail deve ser fornecido',
            'email.email'    => 'O e-mail fornecido é inválido',
            'email.exists'   => 'O e-mail fornecido não está cadastrado'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(
            [
                'error'   => true,
                'message' => $validator->errors()->first()
            ], Response::HTTP_BAD_REQUEST)
        );
    }
}
