<?php

namespace App\Http\Controllers;

use Illuminate\Http\{
    Request,
    Response
};
use App\Models\{
    UserPlan,
    Plan
};
use App\Http\Requests\PlanRequest;

/**
 * @OA\Tag(
 *     name="plan",
 *     description="Planos"
 * )
 */
class PlanController extends Controller
{
    protected $model;

    public function __construct(Plan $plan)
    {
        $this->model = $plan;
    }

    /**
     * @OA\Get(
     *     tags={"plan"},
     *     summary="Lista todos os planos",
     *     description="Lista todos os planos",
     *     path="/api/plan",
     *     @OA\Response(response="200", description="Lista todos os planos cadastrados"),
     * ),
     *
     */
    public function index(Request $request, $onlyActive = false)
    {
        $plans = Plan::query();

        if ($onlyActive) {
            $plans = $plans->active();
        }

        if (isset($request->status) && $request->status !== NULL) {
            $plans->where('status', $request->status);
        }

        $plans = $plans->orderBy('id', 'DESC');

        if (isset($request->per_page)) {
            $plans = $plans->paginate($request->per_page);
        } else {
            $plans = $plans->get();
        }

        return response()->json(['data' => $plans], Response::HTTP_OK);
    }

    /**
     * @OA\Post(
     *   tags={"plan"},
     *   path="/api/plan",
     *   summary="Cadastra um novo plano",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="description",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="price_month",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="price_year",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="percentage_discount_questions",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="percentage_discount_contracts",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="status",
     *            type="boolean",
     *          ),
     *          @OA\Property(
     *            property="recommended",
     *            type="boolean",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(PlanRequest $request)
    {
        if ($request->recommended && $this->ifHaveARecommendedPlan()) {
            return response()->json([
                'error'   => true,
                'message' => 'Já existe um plano recomendado',
            ], Response::HTTP_BAD_REQUEST);
        }

        $plan = $this->model->create($request->validated());

        // ( new MercadoPagoService() )->createMercadoPagoPlan($plan);

        return response()->json([
            'error'   => !$plan,
            'data'    => $plan ? $plan : [],
            'message' => $plan ? 'Cadastrado' : 'Erro ao cadastrar',
        ], $plan ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *   tags={"plan"},
     *   path="/api/plan/{id}",
     *   summary="Exibe um plano",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show($id)
    {
        $plan = $this->model->find($id);

        if (!$plan) {
            return $this->returnIfNotExist();
        }

        return response()->json(['data' => $plan], Response::HTTP_OK);
    }

    /**
     * @OA\Put(
     *   tags={"plan"},
     *   path="api/plan/{id}",
     *   summary="Edita uma plano",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="description",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="price_month",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="price_year",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="percentage_discount_questions",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="percentage_discount_contracts",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="status",
     *            type="boolean",
     *          ),
     *          @OA\Property(
     *            property="recommended",
     *            type="boolean",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function update(PlanRequest $request, $id)
    {
        $plan = $this->model->find($id);

        if (!$plan) {
            return $this->returnIfNotExist();
        }

        if ($request->recommended && $this->ifHaveARecommendedPlan($id)) {
            return response()->json([
                'error'   => true,
                'message' => 'Já existe um plano recomendado',
            ], Response::HTTP_BAD_REQUEST);
        }

        $plan->update($request->validated());

        // ( new MercadoPagoService() )->updateMercadoPagoPlan($plan);

        return response()->json([
            'error'   => !$plan,
            'data'    => $plan ? $plan : [],
            'message' => $plan ? 'Atualizado' : 'Erro ao atualizar',
        ], $plan ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    /**
     * @OA\Delete(
     *   tags={"plan"},
     *   path="/api/plan/{id}",
     *   summary="Remove um plano",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy($id)
    {
        $plan = $this->model->find($id);

        if (!$plan) {
            return $this->returnIfNotExist();
        }

        $userPlan = UserPlan::where('plan_id', $id)->get();

        if ($userPlan->count() > 0) {
            return response()->json([
                'error'   => true,
                'message' => 'Existem usuários atrelados a esse plano'
            ], Response::HTTP_NOT_FOUND);
        }

        $plan = $plan->delete();

        return response()->json([
            'error'   => !$plan,
            'message' => $plan ? 'Plano removido' : 'Erro ao remover plano',
        ], Response::HTTP_CREATED);
    }

    private function returnIfNotExist()
    {
        return response()->json([
            'error'   => true,
            'message' => 'Plano não encontrado'
        ], Response::HTTP_BAD_REQUEST);
    }

    public function ifHaveARecommendedPlan($planId = NULL)
    {
        $plan = Plan::query();

        $plan->where('recommended', 1);

        if ($planId) {
            $plan->where('id', "!=", $planId);
        }

        return $plan->count() ? true : false;
    }
}
