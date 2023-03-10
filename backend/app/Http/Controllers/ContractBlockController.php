<?php

namespace App\Http\Controllers;

use App\Models\ContractBlock;
use App\Models\ContractConditional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="contract-block",
 *     description="Bloco de um contrato"
 * )
 */
class ContractBlockController extends Controller
{
    private $model;
    function __construct(ContractBlock $model)
    {
        $this->model = $model;
    }

    /**
     * @OA\Get(
     *     tags={"contract-block"},
     *     summary="Lista todas bloco de contrato",
     *     description="Lista todas bloco de contrato",
     *     path="/api/contract-block",
     *     @OA\Response(response="200", description="Lista todas bloco de contrato"),
     * ),
     *
     */
    public function index(Request $request)
    {
        $contractBlocks = $this->model->latest('id');
        if (isset($request->termo)) {
            $contractBlocks->where('title', 'like', "%{$request->termo}%");
        }
        if (isset($request->per_page)) {
            $contractBlocks = $contractBlocks->paginate($request->per_page);
        }

        return response()->json($contractBlocks);
    }

    /**
     * @OA\Post(
     *   tags={"contract-block"},
     *   path="/api/contract-block",
     *   summary="Cadastra um novo bloco de contrato",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
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
     *            property="condition_type",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="field_id",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="field_value",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="position",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="slug",
     *            type="string",
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
        DB::beginTransaction();
        try {
            $params = $request->all();
            $contractBlock = ContractBlock::create($params);
            $contractBlock->conditionals()->createMany($params['conditionals']);

            DB::commit();
            return response()->json(['message' => "Bloco cadastrado com sucesso", "result" => $contractBlock], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao criar bloco: {$e->getMessage()}"], 500);
        }
    }

    /**
     * @OA\Get(
     *   tags={"contract-block"},
     *   path="/api/contract-block/{id}",
     *   summary="Exibe um bloco de contrato",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show(Request $request, $id)
    {
        $contractBlock = $this->model->with(['conditionals'])->find($id);
        return response()->json($contractBlock);
    }

    /**
     * @OA\Put(
     *   tags={"contract-block"},
     *   path="/api/contract-block",
     *   summary="Edita um bloco de contrato",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
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
     *            property="condition_type",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="field_id",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="field_value",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="position",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="slug",
     *            type="string",
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
        DB::beginTransaction();
        try {
            $params = $request->all();
            $contractBlock = $this->model->find($id);
            $contractBlock->update($params);

            foreach ($params['conditionals'] as $conditional) {
                if (!isset($conditional['id'])) {
                    $conditional['contract_block_id'] = $contractBlock->id;
                    ContractConditional::create($conditional);
                } else {
                    $registro = ContractConditional::find($conditional['id']);
                    $registro->fill($conditional)->save();
                }
            }

            DB::commit();
            return response()->json(['message' => "Bloco atualizado com sucesso", "result" => $contractBlock], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao atualizar bloco: {$e->getMessage()}"], 500);
        }
    }

    /**
     * @OA\Delete(
     *   tags={"contract-block"},
     *   path="/api/contract-block/{id}",
     *   summary="Remove um bloco de contrato",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $res = $this->model->find($id);
            $res->delete();

            DB::commit();
            return response()->json(['message' => "Bloco excluído com sucesso", "result" => $res], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao excluir Bloco: {$e->getMessage()}"], 500);
        }
    }
}
