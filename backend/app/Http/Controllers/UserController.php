<?php

namespace App\Http\Controllers;

use App\Http\Requests\{
    UserStoreRequest,
    UserUpdateRequest
};
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\{
    Request,
    Response
};
use App\Http\Repositories\UserRepository;
use App\Http\Resources\UserCollection;

/**
 * @OA\Tag(
 *     name="user",
 *     description="Usuários"
 * )
 */
class UserController extends Controller
{
    protected $repository;


    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @OA\Get(
     *     tags={"user"},
     *     summary="Lista todos os usuários",
     *     description="Lista todos os usuários",
     *     path="/api/user",
     *     @OA\RequestBody(
     *       required=true,
     *       @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="integer",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *     @OA\Response(response="200", description="Lista todos os usuários cadastrados"),
     * ),
     *
    */
    public function index(Request $request)
    {
        $users = $this->repository->all($request->all());
        return new UserCollection($users);
    }

    /**
     * @OA\Post(
     *   tags={"user"},
     *   path="/api/user",
     *   summary="Cadastra um novo usuário",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="name",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="email",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="password",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="plan_id",
     *            type="integer",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(UserStoreRequest $request)
    {
        return $this->repository->store($request->validated());
    }

    /**
     * @OA\Get(
     *   tags={"user"},
     *   path="/api/user/{id}",
     *   summary="Exibe um usuário",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show($id)
    {
        $user = $this->repository->show($id);
        return response()->json(['data' => $user]);
    }

    /**
     * @OA\Put(
     *   tags={"user"},
     *   path="/api/user/{id}",
     *   summary="Edita um usuário",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="name",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="email",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="password",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="plan_id",
     *            type="integer",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(Request $request, $id)
    {
        $user = $this->repository->update($request->all(), $id);
        return $user;
    }

    /**
     * @OA\Delete(
     *   tags={"user"},
     *   path="/api/user/{id}",
     *   summary="Remove um usuário",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy($id)
    {
        $user = $this->repository->destroy($id);
        return $user;
    }
}
