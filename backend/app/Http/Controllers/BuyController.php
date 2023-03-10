<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Order;
use App\Models\Plan;
use App\Models\RightArea;
use App\Models\UserPlan;
use App\Models\SiteInfo;
use App\Services\MercadoPago\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BuyController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = $request->user();
            $type = $request->type;
            $userPlan = UserPlan::with('plan')->where('user_id', $user->id)->first();

            $amount = -1;
            if ($type === 'question') {
                $rightArea = RightArea::find($request->right_area_id);
                $amount = SiteInfo::first()->price_question ?? -1;
            } else {
                $contract = Contract::find($request->contract_id);
                $amount = $contract->price ?? -1;
            }

            if ($amount < 0) {
                throw new \Exception('Valor inválido, tente novamente ou entre me contato com o suporte.');
            }

            if ($request->coupon) {
                $amount = (new CouponController())->calculateCouponDiscount($request->coupon, $amount);
            }

            $data = [
                'payer_email' => $user->email,
                'card_token'  => $request->token,
                'amount'      => (float) $amount,
                'installments' => $request->installments,
                'payer' => $request->payer,
                'payment_method_id' => $request->payment_method_id,
            ];

            $service = new MercadoPagoService();

            if ($type == 'question') { //pagamento anual
                $data['description'] = "Compra de consulta: " . ($rightArea->title ?? 'Outros');
                if (!empty($userPlan) && $userPlan->plan->percentage_discount_questions > 0) { //verifica se tem plano e valida os descontos
                    $data['amount'] = Plan::geraDesconto($data['amount'], $userPlan->plan->percentage_discount_questions);
                }
            } else {
                $data['description'] = "Compra do contrato: {$contract->title}";
                if (!empty($userPlan) && $userPlan->plan->percentage_discount_contracts > 0) { //verifica se tem plano e valida os descontos
                    $data['amount'] = Plan::geraDesconto($data['amount'], $userPlan->plan->percentage_discount_contracts);
                }
            }
            $data['amount'] = floatval(number_format($data['amount'], 2, '.', ''));


            if ($data['amount'] > 0) {
                $subscribe = $service->createPayment($data);
                Log::debug('Mercado Pago Payment', $data, $subscribe);
                if (isset($subscribe->error)) {
                    return response()->json($subscribe);
                }

                if ($subscribe->status == 'rejected') {
                    return response()->json(
                        [
                            'error' => true,
                            'message' => "Erro ao realizar pagamento: Pagamento rejeitado",
                            'pay' => $subscribe
                        ],
                        Response::HTTP_OK
                    );
                }
            }

            //create subscribe
            $order = Order::create([
                'description' => $data['description'],
                'type' => $type,
                'amount' => $data['amount'],
                'id_transaction' => isset($subscribe->id) ? $subscribe->id : null,
                'status' => isset($subscribe->status) ? $subscribe->status : 'approved',
                'used' => 'not',
                'user_id' => $user->id,
                'contract_id' => isset($contract) ? $contract->id : null,
                'right_area_id' => isset($rightArea) ? $rightArea->id : null,
            ]);

            DB::commit();
            return response()->json([
                'error'   => false,
                'message' => !isset($subscribe) || $subscribe->status === 'approved' ? 'Pagamento realizado com sucesso.' : 'Pagamento pendente, aguarde a confirmação do pagamento.',
                'pay' => $subscribe ?? null,
                'order' => $order
            ], Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(
                [
                    'error' => true,
                    'message' => "Erro ao realizar pagamento: {$e->getMessage()}"
                ],
                Response::HTTP_OK
            );
        }
    }

    public function notification(Request $request)
    {
        $data = $request->all();
        Log::debug('Mercado Pago Notification', $data);

        if (isset($data["topic"]) && $data["topic"] === 'payment') {
            $service = new MercadoPagoService();
            $payment = $service->getPayment($data["id"]);
            if (!isset($payment->error)) {
                $order = Order::where('id_transaction', $payment->id)->first();
                if ($order) {
                    $order->status = $payment->status;
                    $order->save();
                }
            }
        }
    }
}
