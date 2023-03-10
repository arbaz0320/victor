<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Http\Requests\UserPlanRequest;
use App\Models\{
    UserPlan,
    Plan
};
use Carbon\Carbon;
use Illuminate\Http\{
    Request,
    Response
};

/**
 * @OA\Tag(
 *     name="user-plan",
 *     description="Planos do usuário"
 * )
 */
class UserPlanController extends Controller
{
    protected $model;
    private $userId;

    public function __construct(UserPlan $userPlan)
    {
        $this->model  = $userPlan;
        $this->userId = \Auth::id();
    }
    public function store(UserPlanRequest $request)
    {
        return $this->updateOrCreate($request);
    }

    public function storeUserPlan(Request $request)
    {
        $planId = $request->plan_id;
    }

    public function show(UserPlan $userPlan = null)
    {
        return $this->model->where('user_id', $this->userId);
    }

    public function update(Request $request, UserPlan $userPlan)
    {
        return $this->updateOrCreate($request);
    }

    private function updateOrCreate($request)
    {
        $request->validated();
        $infoPlan = Plan::find($request->plan_id);

        $checkHavePlanInTime = $this->model->where('user_id', $this->userId)
            ->where('expire_at', '>=', Carbon::today())
            ->first();

        if ($checkHavePlanInTime) {
            return response()->json([
                'error'   => true,
                'message' => 'Este usuário possui um plano que ainda ativo'
            ]);
        }

        DB::beginTransaction();
        try {
            $userPlan = $this->model->updateOrCreate([
                'user_id'   => $this->userId,
            ],
            [
                'plan_id'   => $infoPlan->id,
                'expire_at' => Carbon::now()->addDays($infoPlan->period_in_days)
            ]);

            DB::commit();
            return response()->json([
                'error' => false, 'message' => 'Plano atrelado ao usuário'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => true, 'message' => 'Error ao cadastrar'], Response::HTTP_BAD_REQUEST);
        }
    }

    public function destroy(UserPlan $userPlan)
    {
        //
    }

    public function validateUserInActivePlan()
    {
        return UserPlan::where('expire_at', '<=', Carbon::now())->first();
    }
}
