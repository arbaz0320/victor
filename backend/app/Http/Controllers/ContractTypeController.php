<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContractTypeRequest;
use App\Models\ContractType;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\{
    Request,
    Response
};

/**
 * @OA\Tag(
 *     name="contract-type",
 *     description="Tipos de contrato"
 * )
 */
class ContractTypeController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"contract-type"},
     *     summary="Lista todos os tipos de contratos",
     *     description="Lista todos os tipos de contratos",
     *     path="/api/contract-type",
     *     @OA\Response(response="200", description="Lista todos os tipos de contratos cadastrados"),
     * ),
     *
     */
    public function index(Request $request)
    {
        $response = ContractType::orderBy('created_at', 'DESC');

        if (isset($request->per_page)) {
            $response = $response->paginate($request->per_page);
        } else {
            $response = $response->get();
        }

        return response()->json($response);
    }

    /**
     * @OA\Post(
     *   tags={"contract-type"},
     *   path="/api/contract-type",
     *   summary="Cadastra um novo tipo de contrato",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(ContractTypeRequest $request)
    {
        try {
            DB::beginTransaction();
            $contractType = ContractType::create($request->validated());

            DB::commit();

            return response()->json([
                'error'   => false,
                'data'    => $contractType,
                'message' => 'Cadastrado com sucesso'
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error'   => true,
                'data'    => [],
                'message' => 'Error ao atualizar'
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @OA\Get(
     *   tags={"contract-type"},
     *   path="/api/contract-type/{id}",
     *   summary="Exibe um tipo de contrato",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show(Request $request, ContractType $contractType)
    {
        return response()->json($contractType);
        // return new ContractTypeResource($contractType);
    }

    /**
     * @OA\Put(
     *   tags={"contract-type"},
     *   path="/api/contract-type",
     *   summary="Editado um tipo de contrato",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(ContractTypeRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $contractType = ContractType::find($id);
            $contractType->fill($request->validated($request->all()))->save();

            DB::commit();

            return response()->json([
                'error'   => false,
                'data'    => $contractType,
                'message' => 'Atualizado com sucesso'
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error'   => true,
                'data'    => [],
                'message' => 'Erro ao atualizar'
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @OA\Delete(
     *   tags={"contract-type"},
     *   path="/api/contract-type/{id}",
     *   summary="Remove um tipo de contrato",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(ContractType $contractType)
    {
        if (!$contractType) {
            return response()->json([
                'error' => true,
                'message' => 'Erro ao remover'
            ], Response::HTTP_BAD_REQUEST);
        }

        $contractType->delete();

        return response()->json([
            'error' => false,
            'message' => 'Removido'
        ], Response::HTTP_CREATED);
    }
}
