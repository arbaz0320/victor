<?php

namespace App\Http\Repositories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    public function all($data)
    {
        $users = User::query()->with('role');

        if (isset($data['per_page']) && !empty($data['per_page'])) {
            $users->paginate($data['per_page']);
        }

        $users = $users->get();

        return $users;
    }

    public function store($data)
    {
        DB::beginTransaction();
        try {
            $data['password'] = Hash::make($data['password']);
            $data['role_id'] = Role::where(['description' => 'CLIENT'])->first()->id;
            $user =  User::create($data);

            DB::commit();

            return response()->json(['error' => false, 'data' => $user, 'message' => 'Cadastrado com sucesso'], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return response()->json(['error' => true, 'message' => 'Erro ao cadastrar usuário'], Response::HTTP_BAD_REQUEST);
        }
    }

    public function show($id)
    {
        return User::with('role')->find($id);
    }

    public function update($data, $id)
    {
        try {
            DB::beginTransaction();

            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => true, 'message' => 'Usuário não encontrado!'], Response::HTTP_BAD_REQUEST);
            }

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user->fill($data);
            $user->save();

            DB::commit();

            return response()->json(['error' => false, 'data' => $user, 'message' => 'Atualizado com sucesso'], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return response()->json(['error' => true, 'message' => 'Erro ao atualizar'], Response::HTTP_BAD_REQUEST);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => true, 'message' => 'Usuário não encontrado!'], Response::HTTP_BAD_REQUEST);
        }

        $user->delete();
        return response()->json(['error' => false, 'message' => 'Removido com sucesso'], Response::HTTP_OK);
    }
}
