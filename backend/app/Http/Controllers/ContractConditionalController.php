<?php

namespace App\Http\Controllers;

use App\Models\ContractConditional;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="contract-conditional",
 *     description="Condicionais de um contrato"
 * )
 */
class ContractConditionalController extends Controller
{
    private $model;
    function __construct(ContractConditional $model)
    {
        $this->model = $model;
    }

    /**
     * @OA\Get(
     *     tags={"contract-conditional"},
     *     summary="Lista todas as condicionais de contrato",
     *     description="Lista todas as condicionais de contrato",
     *     path="/api/contract-conditional",
     *     @OA\Response(response="200", description="Lista todas as condicionais de contrato cadastradas"),
     * ),
     *
    */
    public function index(Request $request)
    {
        $ContractConditionals = $this->model->paginate();

        return response()->json($ContractConditionals);
    }

    /**
     * @OA\Post(
     *   tags={"contract-conditional"},
     *   path="/api/contract-conditional",
     *   summary="Cadastra uma nova condicional de contrato",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="label",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="question",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="description",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="text",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="contract_block_id",
     *            type="integer",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(Request $request)
    {
        $ContractConditional = $this->model->create($request->all());

        return response()->json($ContractConditional);
    }

    /**
     * @OA\Get(
     *   tags={"contract-conditional"},
     *   path="/api/contract-conditional/{id}",
     *   summary="Exibe uma condicional de contrato",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show(Request $request, ContractConditional $ContractConditional)
    {
        return response()->json($ContractConditional);
    }

    /**
     * @OA\Put(
     *   tags={"contract-conditional"},
     *   path="/api/contract-conditional",
     *   summary="Edita uma condicional de contrato",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="label",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="question",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="description",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="text",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="contract_block_id",
     *            type="integer",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(Request $request, ContractConditional $ContractConditional)
    {
        $ContractConditional->update($request->all());

        return response()->json($ContractConditional);
    }

    /**
     * @OA\Delete(
     *   tags={"contract-conditional"},
     *   path="/api/contract-conditional/{id}",
     *   summary="Remove uma condicional de contrato",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Request $request, ContractConditional $ContractConditional)
    {
        $ContractConditional->delete();

        return response()->json($ContractConditional);
    }
}
