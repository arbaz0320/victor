<?php

namespace App\Http\Controllers;

use Illuminate\Http\{
    Request,
    Response
};
use App\Services\MercadoPago\MercadoPagoService;
use App\Models\{
    Plan,
    User,
    UserPlan
};
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class SubscribeController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $plan = Plan::find($request->plan_id);
            // $user = User::first();
            $user = $request->user();
            $plan_type = $request->plan_type;

            $amount = $plan_type === 'yearly' ? $plan->price_year : $plan->price_month;
            if ($request->coupon) {
                $amount = (new CouponController())->calculateCouponDiscount($request->coupon, $amount);
            }

            $data = [
                'payer_email' => $user->email,
                'card_token'  => $request->token,
                'description'      => $plan->name,
                'amount'      => (float) $amount,
            ];

            $service = new MercadoPagoService();

            if ($plan_type == 'yearly') { //pagamento anual
                $data['installments'] = $request->installments;
                $data['payer'] = $request->payer;
                $data['payment_method_id'] = $request->payment_method_id;

                $data['end_date'] = Carbon::tomorrow()->addMonth(12)->format('Y-m-d\TH:i:s.BP');

                $subscribe = $service->createPayment($data);
            } else {
                $data['start_date'] = Carbon::tomorrow()->format('Y-m-d\TH:i:s.BP');
                $data['end_date'] = Carbon::tomorrow()->addMonth(1)->format('Y-m-d\TH:i:s.BP');
                $subscribe = $service->createApproval($data);
            }
            Log::debug('Mercado Pago Subscribe', $data, $subscribe);

            if (isset($subscribe->error)) {
                return response()->json($subscribe);
            }

            if (!in_array($subscribe->status, ['approved', 'authorized'])) {
                return response()->json([
                    'error'   => true,
                    'message' => 'Não foi possível adquirir o plano, o pagamento não foi aprovado.'
                ]);
            }

            $checkPlan = UserPlan::where('user_id', $user->id)->first();
            if (!empty($checkPlan)) {
                $checkPlan->delete();
            }

            //create subscribe
            UserPlan::create([
                'plan_id' => $plan->id,
                'user_id' => $user->id,
                'percentage_discount_questions' => $plan->percentage_discount_questions,
                'percentage_discount_contracts' => $plan->percentage_discount_contracts,
                'price_month' => $plan->price_month,
                'price_year' => $plan->price_year,
                'expire_at' => date('Y-m-d H:i:s', strtotime($data['end_date'])),
                'plan_type' => $plan_type,
                'id_transaction' => $subscribe->id,
            ]);

            try {
                Http::withToken(env('MAIL_PASSWORD'))->post('https://api.sendgrid.com/v3/mail/send', [
                    'from' => [
                        'email' => 'naoresponda@advogadossc.com'
                    ],
                    'personalizations' => [
                        [
                            'to' => [
                                [
                                    'email' => $user->email,
                                    'name' => $user->name
                                ]
                            ],
                            'dynamic_template_data' => [
                                'type' => 'plan',
                                'client_name' => $user->name,
                                'plan_name' => $plan->name,
                                'total' => $amount
                            ]
                        ]
                    ],
                    'template_id' => 'd-b072e3ad44124ac28c7360b15fa5a34b'
                ]);
            } catch (\Exception $e) {
                Log::debug('Subscribe Sendgrid', $e->getMessage());
            }

            DB::commit();
            return response()->json([
                'error'   => false,
                'message' => 'Agora você pode utilizar seu plano à vontade!'
            ], Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(
                [
                    'error' => true,
                    'message' => "Erro ao adquirir um plano: {$e->getMessage()}"
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function getPreApproval(Request $request)
    {
        $orderId = $request->order_id;

        $service = new MercadoPagoService($orderId);
        $service->getApproval($orderId);
    }

    public function updatePreApproval($planId)
    {
        $service = new MercadoPagoService();
        // $service->updatePlan($planId);
    }

    public function notification(Request $request)
    {
        Log::debug("response SUBSCRIBE MP", $request->all());
    }
}
