<?php

namespace App\Services\MercadoPago;

use App\Http\Controllers\OrderController;
use Carbon\Carbon;
use App\Models\Order;
use App\Models\Plan;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;

class MercadoPagoService
{
    private $client;

    public function __construct()
    {
        $token = getenv("MERCADO_PAGO_TOKEN");

        $this->client = new Client([
            'base_uri' => 'https://api.mercadopago.com',
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json',
            ]
        ]);
    }


    // Assinaturas
    public function createApproval($data)
    {
        $payload = [
            'payer_email' => $data['payer_email'],
            'card_token_id' => $data['card_token'],
            'back_url' => env('MERCADO_PAGO_BACK_URL_SUBSCRIBE'),
            'reason' => $data['description'],
            'status' => 'authorized',
            'auto_recurring' => [
                "frequency" => 1,
                "frequency_type" => "months",
                "transaction_amount" => number_format($data['amount'], 2),
                "currency_id" => "BRL",
                "start_date" => $data['start_date'],
                "end_date" => $data['end_date'],
                "free_trial" => [
                    "frequency" => 7,
                    "frequency_type" => "days"
                ]
            ]
        ];

        try {
            $response = $this->client->request('POST', '/preapproval', ['json' => $payload]);

            $responseJson = json_decode($response->getBody()->getContents());
            return $responseJson;
        } catch (ClientException $e) {
            Log::error($e->getMessage());
            $content = json_decode($e->getResponse()->getBody()->getContents());
            return (object) array('error' => true, "content" => $content, "message" => $content->message ?? 'Indefinido');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return (object) array('error' => true, "message" => $e->getMessage());
        }
    }
    public function getApproval($preapprovalId)
    {
        try {
            $response = $this->client->request('GET', "/preapproval/{$preapprovalId}");

            $responseJson = json_decode($response->getBody()->getContents());

            return $responseJson;
        } catch (ClientException $e) {
            Log::error($e->getMessage());
            $content = json_decode($e->getResponse()->getBody()->getContents());
            return (object) array('error' => true, "content" => $content, "message" => $content->message ?? 'Indefinido');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return (object) array('error' => true, "message" => $e->getMessage());
        }
    }

    //Pagamentos
    public function createPayment($data)
    {
        $payload = [
            "description" => $data['description'],
            "token" => $data['card_token'],
            "statement_descriptor" => "SC-ADVOGADOS",
            "installments" => $data['installments'],
            "payer" => [
                "email" => $data['payer']['email'],
                "identification" =>
                [
                    "type" => $data['payer']['identification']['type'],
                    "number" => $data['payer']['identification']['number']
                ]
            ],
            "payment_method_id" => $data['payment_method_id'],
            "capture" => true,
            "transaction_amount" => $data['amount'],
            "notification_url" => env('MERCADO_PAGO_BACK_URL_BUY'),
        ];

        try {
            $response = $this->client->request('POST', '/v1/payments', ['json' => $payload]);

            $responseJson = json_decode($response->getBody()->getContents());
            return $responseJson;
        } catch (ClientException $e) {
            Log::error($e->getMessage());
            $content = json_decode($e->getResponse()->getBody()->getContents());
            return (object) array('error' => true, "content" => $content, "message" => $content->message ?? 'Indefinido');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return (object) array('error' => true, "message" => $e->getMessage());
        }
    }

    public function getPayment($id)
    {
        try {
            $response = $this->client->request('GET', "/v1/payments/{$id}");

            $responseJson = json_decode($response->getBody()->getContents());

            return $responseJson;
        } catch (ClientException $e) {
            Log::error($e->getMessage());
            $content = json_decode($e->getResponse()->getBody()->getContents());
            return (object) array('error' => true, "content" => $content, "message" => $content->message ?? 'Indefinido');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return (object) array('error' => true, "message" => $e->getMessage());
        }
    }

    //Planos
    public function createMercadoPagoPlan($plan)
    {
        $payload = $this->organizeDataMercadoPagoPlan($plan, 'store');

        foreach ($payload as $index => $pay) {
            $info = $this->client->request('POST', '/preapproval_plan', ['json' => $pay]);
            $info = $info->getBody()->getContents();
            $info = json_decode($info);

            $fieldsToUpdate = ['mp_month_id', 'mp_year_id'];
            $updatePlan = Plan::find($plan->id);
            $updatePlan->update([$fieldsToUpdate[$index] => $info->id]);
        }
    }

    public function updateMercadoPagoPlan($plan)
    {
        $payload = $this->organizeDataMercadoPagoPlan($plan, 'update');

        try {
            foreach ($payload as $pay) {
                $this->client->request('PUT', "/preapproval_plan/{$pay['id']}", ['json' => $pay]);
            }
        } catch (ClientException $e) {
            Log::error($e->getMessage());
            $content = json_decode($e->getResponse()->getBody()->getContents());
            return (object) array('error' => true, "content" => $content, "message" => $content->message ?? 'Indefinido');
        }
    }

    private function organizeDataMercadoPagoPlan($data, $method)
    {
        $maxDaysAllowed = 28;
        $billingDay = Carbon::now()->day < $maxDaysAllowed
            ? Carbon::now()->day
            : $maxDaysAllowed;

        $typesOfAPlan = [
            [
                'id'             => $data->mp_month_id,
                'frequency'      => 1,
                'frequency_type' => 'months',
                'amount'         => $data->price_month
            ],
            [
                'id'             => $data->mp_year_id,
                'frequency'      => 1,
                'frequency_type' => 'months',
                'repetitions'    => 12,
                'amount'         => $data->price_year
            ]
        ];

        $payload = [];

        foreach ($typesOfAPlan as $index => $plan) {

            $payload[] = [
                'reason' => $data->name,
                'auto_recurring' => [
                    'frequency' => $plan['frequency'],
                    'frequency_type' => $plan['frequency_type'],
                    'billing_day' => $billingDay,
                    'billing_day_proportional' => true,
                    'free_trial' => [
                        'frequency' => 7,
                        'frequency_type' => "days"
                    ],
                    'transaction_amount' => $plan['amount'],
                    'currency_id' => "BRL"
                ],
                'back_url' => env('MERCADO_PAGO_BACK_URL')
            ];

            if (isset($plan['repetitions'])) {
                $payload[$index]['auto_recurring']['repetitions'] = $plan['repetitions'];
            }

            if ($method === 'update') {
                $payload[$index]['id'] = $plan['id'];
            }
        }

        return $payload;
    }
}
