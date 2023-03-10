<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleStoreRequest;
use App\Http\Requests\RoleUpdateRequest;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\RoleResource;
use App\Models\{
    Role,
    User
};
use Illuminate\Http\{
    Request,
    Response
};

/**
 * @OA\Tag(
 *     name="role",
 *     description="Permissões"
 * )
 */
class RoleController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"role"},
     *     summary="Lista todas as roles",
     *     description="Lista todas as roles",
     *     path="/api/role",
     *     @OA\Response(response="200", description="Lista todas as roles cadastradas"),
     * ),
     *
    */
    public function index(Request $request)
    {
        $roles = Role::all();

        return new RoleCollection($roles);
    }

    /**
     * @OA\Post(
     *   tags={"role"},
     *   path="/api/role",
     *   summary="Cadastra uma nova role",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="description",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(RoleStoreRequest $request)
    {
        $role = Role::create($request->validated());

        return new RoleResource($role);
    }

    /**
     * @OA\Get(
     *   tags={"role"},
     *   path="/api/role/{id}",
     *   summary="Exibe uma role",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show(Request $request, Role $role)
    {
        return new RoleResource($role);
    }

    /**
     * @OA\put(
     *   tags={"role"},
     *   path="/api/role",
     *   summary="Edita uma role",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="description",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(RoleUpdateRequest $request, Role $role)
    {
        $role->update($request->validated());

        return new RoleResource($role);
    }

    /**
     * @OA\Delete(
     *   tags={"role"},
     *   path="/api/role/{id}",
     *   summary="Remove uma role",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Request $request, Role $role)
    {
        $users = User::where('role_id', $role->id)->get();

        if ($users->count() > 0) {
            return response()->json([
                'error'   => true,
                'message' => 'Existem usuários atrelados a essa role'
            ], Response::HTTP_NOT_FOUND);
        }

        $role->delete();

        return response()->noContent();
    }
}
