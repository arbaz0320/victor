<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    'mercadopago' => [
        'app_id'     => env('MP_APP_ID', 'TEST-e6655356-62a7-47f7-95d4-d8971bfbfcdf'),
        'app_secret' => env('MP_APP_SECRET', 'TEST-1089370619193164-060316-527278215107bd8e1dcbeb9f6976def5-646086381'),
        'back_url'   => env('MP_BACK_URL', env('APP_URL')),
    ],
];
