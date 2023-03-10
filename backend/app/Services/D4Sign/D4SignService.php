<?php

namespace App\Services\D4Sign;

use App\Tools\UtilTools;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class D4SignService
{
    protected $act = ['parte' => 4, 'testemunha' => 5, 'fiador' => 10];
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => getenv("D4SIGN_PROD") == 'false' ? "https://sandbox.d4sign.com.br" : "https://secure.d4sign.com.br",
            'query' => [
                'tokenAPI' => getenv("D4SIGN_TOKEN_API"),
                'cryptKey' => getenv("D4SIGN_CRIPTKEY_API"),
            ],
        ]);
    }

    public function getSafe()
    {
        try {
            $safe = $this->client->request("GET", "/api/v1/safes", [
                'headers' => [
                    'Accept' => 'application/json',
                ],
            ]);
            return json_decode($safe->getBody()->getContents());
        } catch (ClientException $e) {
            return UtilTools::exceptionsErrors("getSafe {$e->getMessage()}", $e->getResponse()->getBody()->getContents());
        } catch (Exception $e) {
            return UtilTools::exceptionsErrors("getSafe Exception {$e->getMessage()}");
        }
    }

    public function uploadDocument(string $document_base_64, string $description)
    {
        try {
            $safe = $this->getSafe();
            if (isset($safe->error)) {
                return $safe;
            }

            $response = $this->client->request("POST", "/api/v1/documents/{$safe[0]->uuid_safe}/uploadbinary", [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type: application/json'
                ],
                'json' => [
                    "base64_binary_file" => $document_base_64,
                    "mime_type" => "application/pdf",
                    "name" => $description,
                    // "uuid_folder" => "{UUID DA PASTA}"
                ]
            ]);
            return json_decode($response->getBody()->getContents());
        } catch (ClientException $e) {
            return UtilTools::exceptionsErrors("uploadDocument {$e->getMessage()}", $e->getResponse()->getBody()->getContents());
        } catch (Exception $e) {
            return UtilTools::exceptionsErrors("uploadDocument Exception {$e->getMessage()}");
        }
    }

    public function createWebHook(string $document_id, string $url = null)
    {
        try {
            if ($url = null) {
                $url = getenv("D4SIGN_WEBHOOK_API");
            }

            $response = $this->client->request("POST", "/api/v1/documents/{$document_id}/webhooks", [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type: application/json'
                ],
                'json' => [
                    "url" => $url
                ]
            ]);
            return json_decode($response->getBody()->getContents());
        } catch (ClientException $e) {
            return UtilTools::exceptionsErrors("createWebHook {$e->getMessage()}", $e->getResponse()->getBody()->getContents());
        } catch (Exception $e) {
            return UtilTools::exceptionsErrors("createWebHook Exception {$e->getMessage()}");
        }
    }

    public function createSignatories(string $document_id, array $signatories)
    {
        $signers = [];
        foreach ($signatories as $signatory) {
            $signers[] = [
                "email" => $signatory['email'],
                "act" => $this->act[$signatory['type']],
                "foreign" => "0",
                "certificadoicpbr" => "0",
                "assinatura_presencial" => "0",
                "docauth" => "0",
                "docauthandselfie" => "0",
                "embed_methodauth" => "email",
                // "embed_smsnumber" => "",
                // "upload_allow" => "0",
                // "upload_obs" => "Contrato Social e Conta de Luz",
                // "whatsapp_number" => "+5511981876540",
            ];
        }
        try {
            $response = $this->client->request("POST", "/api/v1/documents/{$document_id}/createlist", [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type: application/json'
                ],
                'json' => [
                    "signers" => $signers
                ]
            ]);
            return json_decode($response->getBody()->getContents());
        } catch (ClientException $e) {
            return UtilTools::exceptionsErrors("createSignatories {$e->getMessage()}", $e->getResponse()->getBody()->getContents());
        } catch (Exception $e) {
            return UtilTools::exceptionsErrors("createSignatories Exception {$e->getMessage()}");
        }
    }

    public function sendForSignature(string $document_id)
    {
        try {
            $response = $this->client->request("POST", "/api/v1/documents/{$document_id}/sendtosigner", [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type: application/json'
                ],
                'json' => [
                    // "message" => "{mensagem_para_o_signatário}",
                    "skip_email" => "0",
                    "workflow" => "0",
                    // "tokenAPI" => getenv("D4SIGN_TOKEN_API")
                ]
            ]);
            return json_decode($response->getBody()->getContents());
        } catch (ClientException $e) {
            return UtilTools::exceptionsErrors("sendForSignature {$e->getMessage()}", $e->getResponse()->getBody()->getContents());
        } catch (Exception $e) {
            return UtilTools::exceptionsErrors("sendForSignature Exception {$e->getMessage()}");
        }
    }

    public function downloadDocument(string $document_id)
    {
        try {
            $response = $this->client->request("POST", "/api/v1/documents/{$document_id}/download", [
                'json' => [
                    "type" => "PDF",
                    "language" => "pt"
                ]
            ]);
            return json_decode($response->getBody()->getContents());
        } catch (ClientException $e) {
            return UtilTools::exceptionsErrors("downloadDocument {$e->getMessage()}", $e->getResponse()->getBody()->getContents());
        } catch (Exception $e) {
            return UtilTools::exceptionsErrors("downloadDocument Exception {$e->getMessage()}");
        }
    }
}
