<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
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
            'name' => ['required', 'string'],
            // 'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'password'],
            // 'role_id' => ['required', 'integer'],
            'active' => ['required'],
        ];
    }
}
