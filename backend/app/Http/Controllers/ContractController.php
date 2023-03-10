<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContractRequest;
use App\Models\Contract;
use Illuminate\Http\{
    Request,
    Response
};
use Illuminate\Support\Facades\DB;
use App\Models\ContractBlock;
use App\Models\ContractGenerated;
use App\Models\ContractSignatories;
use App\Models\FieldsBlock;
use App\Models\Order;
use App\Services\D4Sign\D4SignService;
use App\Tools\UtilTools;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * @OA\Tag(
 *     name="contract",
 *     description="Contratos"
 * )
 */
class ContractController extends Controller
{
    private $model;
    function __construct(Contract $model)
    {
        $this->model = $model;
    }

    /**
     * @OA\Get(
     *     tags={"contract"},
     *     summary="Lista todos os contratos",
     *     description="Lista todos os contratos",
     *     path="/api/contract",
     *     @OA\Response(response="200", description="Lista todos os contratos cadastrados"),
     * ),
     *
     */
    public function index(Request $request, $onlyActive = false)
    {
        $contracts = $this->model
            ->with(['type'])
            ->orderBy('created_at', 'DESC');

        if ($onlyActive) {
            $contracts = $contracts->active();
        }

        if (isset($request->per_page)) {
            $contracts = $contracts->paginate($request->per_page);
        } else {
            $contracts = $contracts->get();
        }

        return response()->json(['data' => $contracts]);
    }

    /**
     * @OA\Post(
     *   tags={"contract"},
     *   path="/api/contract",
     *   summary="Cadastra um novo contrato",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="text",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="type_id",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="status",
     *            type="boolean",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(ContractRequest $request)
    {
        DB::beginTransaction();
        try {
            $params = $request->all();
            $contract = $this->model->create($request->validated($params));

            DB::commit();
            return response()->json(
                [
                    'error' => false,
                    'message' => "Contrato cadastrado com sucesso",
                    "data" => $contract
                ],
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'error' => true,
                    'message' =>
                    "Falha ao criar contrato: {$e->getMessage()}"
                ],
                500
            );
        }
    }

    /**
     * @OA\Get(
     *   tags={"contract"},
     *   path="/api/contract/{id}",
     *   summary="Exibe um contrato",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show(Request $request, $id)
    {
        $contract        = $this->model->with(['type', 'signatories'])->find($id);
        $blocksAndFields = $this->extractVariablesFromtext($contract->text);
        $contractInfo    = $this->getBlocksOrFields($contract, $blocksAndFields);
        $contractInfo    = $this->getVariablesInConditionalText($contractInfo);

        $contractInfo    = $this->addSignatureFields($contractInfo);

        return response()->json(['data' => $contractInfo]);
    }

    private function extractVariablesFromtext($text)
    {
        preg_match_all('/{{\$(.*?)}}/', $text, $result);
        return $result[1] ?? [];
    }

    private function getBlocksOrFields($contract, $blocksOrFields)
    {
        $arrayMatches = [];

        foreach ($blocksOrFields as $blockOrField) {
            $model = Str::contains($blockOrField, '_block') ? new ContractBlock() : new FieldsBlock();
            $query = $model->where('slug', $blockOrField);

            if ($model instanceof \App\Models\ContractBlock) {
                $query->with(['field.options', 'conditionals']);
            } else {
                $query->with(['options']);
            }

            $query = $query->first();

            $query !== NULL && ($arrayMatches[$blockOrField] = $query);
        }

        $contract->setAttribute('block_or_fields', $arrayMatches);

        return $contract;
    }

    private function getVariablesInConditionalText($contract)
    {
        if (!isset($contract->block_or_fields)) {
            return $contract;
        }

        foreach ($contract->block_or_fields as $block) {

            if (!empty($block->conditionals)) {

                foreach ($block->conditionals as $key => $conditional) {
                    $fieldsInConditional = $this->extractVariablesFromtext($conditional->text);

                    $fieldsInfo = [];
                    foreach ($fieldsInConditional as $field) {
                        $query = \App\Models\FieldsBlock::where('slug', $field)->with(['options'])->first();
                        $query !== NULL && ($fieldsInfo[$field] = $query);
                    }

                    $conditional->fields_in_conditional = $fieldsInfo;
                }
            }
        }

        return $contract;
    }

    private function addSignatureFields($contract)
    {
        $block_or_fields = $contract->block_or_fields;
        foreach ($contract->signatories as $i => $signatory) {
            $slug = "signature_field_{$i}";
            $block_or_fields[$slug] = [
                "id" => $slug,
                "title" => "Email para assinatura.",
                "question" => $signatory->question,
                "description" => $signatory->description,
                "type" => "email",
                "mask" => null,
                "position" => 0,
                "required" => 1,
                "condition_type" => null,
                "field_id" => null,
                "field_value" => null,
                "slug" => $slug,
            ];
        }

        $contract->block_or_fields = $block_or_fields;
        return $contract;
    }

    /**
     * @OA\Put(
     *   tags={"contract"},
     *   path="/api/contract",
     *   summary="Edita um usuário",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="text",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="type_id",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="status",
     *            type="boolean",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(ContractRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $params = $request->all();
            $contract = $this->model->with(['type'])->find($id);

            $contract->fill($request->validated($params))->save();

            DB::commit();
            return response()->json(
                [
                    'error' => false,
                    'message' => "Contrato atualizado com sucesso",
                    "result" => $contract
                ],
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'error' => true,
                    'message' => "Falha ao atualizar contrato: {$e->getMessage()}"
                ],
                500
            );
        }
    }

    /**
     * @OA\Delete(
     *   tags={"contract"},
     *   path="/api/contract/{id}",
     *   summary="Remove um contrato",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Contract $contract)
    {
        if (!$contract) {
            return response()->json([
                'error' => true,
                'message' => 'Erro ao remover'
            ], Response::HTTP_BAD_REQUEST);
        }

        $contract->delete();

        return response()->json([
            'error' => false,
            'message' => 'Contrato removido com sucesso.'
        ], Response::HTTP_OK);
    }


    public function signature(Request $request, $order_id)
    {
        set_time_limit(600);
        try {
            $order = Order::where('id', $order_id)->where('user_id', $request->user()->id)->first();
            if (empty($order)) {
                return response()->json(UtilTools::exceptionsErrors("Não foi possível localizar a aquisição deste contrato."));
            }
            $contractGenerated = ContractGenerated::where('order_id', $order->id)->first();
            if (empty($contractGenerated)) {
                return response()->json(UtilTools::exceptionsErrors("Não foi possível localizar o contrato preenchido."));
            }
            if ($contractGenerated->signed == 1) {
                return response()->json(UtilTools::exceptionsErrors("Contrato ja foi assinado."));
            }

            $contract = Contract::with(['signatories'])->find($order->contract_id);
            $D4Service = new D4SignService();

            ///step 1 upload document
            if (!isset($contractGenerated->document_id)) {
                $pdf = App::make('snappy.pdf');
                $pdf->setOption('margin-top', '40mm');
                $pdf->setOption('margin-bottom', '20mm');
                $pdf->setOption('header-html', view('header_template_paper')->render());
                $pdf->setOption('footer-html', view('footer_template_paper')->render());
                $pdfBinary = $pdf->getOutputFromHtml(
                    (new ContractGeneratedController())->_getContent($contractGenerated, true)
                );
                $document_base_64 = base64_encode($pdfBinary);

                $responseUploadDocument = $D4Service->uploadDocument($document_base_64, $contract->title);
                if (isset($responseUploadDocument->error)) {
                    return response()->json($responseUploadDocument);
                }
                //save id document in D4sign
                $contractGenerated->document_id = $responseUploadDocument->uuid;
                $contractGenerated->save();
                // return response()->json(UtilTools::exceptionsErrors("Contrato ja foi assinado."));
            }

            //step 2 register webhook
            if (!isset($contractGenerated->webhook)) {
                $responseWebhook = $D4Service->createWebHook($contractGenerated->document_id);
                if (isset($responseWebhook->error)) {
                    return response()->json($responseWebhook);
                }
                $contractGenerated->webhook = env("D4SIGN_WEBHOOK_API");
                $contractGenerated->save();
            }

            // return $this->prepareSignatories($contractGenerated, $contract->signatories);
            //step 3 create signatories
            if (!isset($contractGenerated->signatories)) {
                $responseSignatories = $D4Service->createSignatories($contractGenerated->document_id, $this->prepareSignatories($contractGenerated, $contract->signatories));
                if (isset($responseSignatories->error)) {
                    return response()->json($responseSignatories);
                }
                $contractGenerated->signatories = json_encode($responseSignatories);
                $contractGenerated->save();
            }

            //step 4 send for signature
            if ($contractGenerated->signed == 0) {
                $responseSendSignature = $D4Service->sendForSignature($contractGenerated->document_id);
                if (isset($responseSendSignature->error)) {
                    return response()->json($responseSendSignature);
                }
                $contractGenerated->signed = 1;
                $contractGenerated->save();
            }

            return response()->json([
                'error' => false,
                'message' => 'Seu Contrato já está disponível em “Seus Contratos” no seu perfil.'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(UtilTools::exceptionsErrors($e->getMessage()));
        }
    }

    private function prepareSignatories($contractGenerated, $contractSignatories)
    {
        $responses = json_decode($contractGenerated->json_response);
        $resp = [];
        $index = 0;
        foreach ($responses->answers as $key => $value) {
            if (strpos($key, 'signature_field') !== false) {
                $resp[] = ["email" => $value, 'type' => $contractSignatories[$index]->type];
                $index++;
            }
        }
        return $resp;
    }

    public function notification(Request $request)
    {
        Log::debug("response D4", $request->all());
    }
}
