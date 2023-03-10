<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    BuyController,
    ContractBlockController,
    ContractConditionalController,
    ContractController,
    ContractCouponController,
    ContractGeneratedController,
    ContractSignatoriesController,
    ContractTypeController,
    CouponController,
    FaqController,
    FieldsBlockController,
    MessageController,
    PlanController,
    PublicRoutesController,
    RoleController,
    SiteInfoController,
    SubscribeController,
    UserController,
    UserPlanController,
};

Route::group(['prefix' => 'public-routes'], function () {
    Route::get('plan', [PublicRoutesController::class, 'plan']);

    Route::post('user', [PublicRoutesController::class, 'user']);
    Route::post('reset-password', [PublicRoutesController::class, 'resetPassword']);

    Route::get('contract', [PublicRoutesController::class, 'contracts']);
    Route::get('contract/{id}', [PublicRoutesController::class, 'contractShow']);

    // Recebe dados do form de contato do site para disparo de e-mail
    Route::post('contact', [PublicRoutesController::class, 'contact']);

    // Get info site dinâmico
    Route::get('deposition', [PublicRoutesController::class, 'deposition']);
    Route::get('right-area', [PublicRoutesController::class, 'rights']);
    Route::get('site-info', [PublicRoutesController::class, 'siteInfo']);
    Route::get('faq', [PublicRoutesController::class, 'faq']);
});

Route::post('subscribe/notifications', [SubscribeController::class, 'notification']);
Route::post('buy/notifications', [BuyController::class, 'notification']);
Route::post('contract/notifications', [ContractController::class, 'notification']);

Route::post('auth', [AuthController::class, 'login']);
Route::post('auth/has-user', [AuthController::class, 'hasUser']);

Route::group(['middleware' => ['apiJWT']], function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::get('auth/logout', [AuthController::class, 'logout']);

    Route::prefix('subscribe')->group(function () {
        Route::post('', [SubscribeController::class, 'store']);

    });
    Route::prefix('buy')->group(function () {
        Route::post('', [BuyController::class, 'store']);
    });

    Route::prefix('contract')->group(function () {
        Route::apiResource('signatories', ContractSignatoriesController::class);

        Route::post('signature/{id}', [ContractController::class, 'signature']);
    });

    Route::apiResource('role', RoleController::class);
    Route::apiResource('user', UserController::class);
    Route::apiResource('contract', ContractController::class);
    Route::apiResource('contract-type', ContractTypeController::class);
    Route::apiResource('contract-block', ContractBlockController::class);
    Route::apiResource('contract-conditional', ContractConditionalController::class);
    Route::apiResource('fields-block', FieldsBlockController::class);
    Route::apiResource('contract-generated', ContractGeneratedController::class);
    Route::get('contract-generated/to-pdf/{id}', [ContractGeneratedController::class, 'toPdf']);
    Route::get('contract-generated/to-word/{id}', [ContractGeneratedController::class, 'toWord']);

    Route::apiResource('coupon', CouponController::class);
    Route::get('coupon/check/{coupon}', [CouponController::class, 'validateCoupon']);

    Route::apiResource('contract-coupon', ContractCouponController::class);
    Route::apiResource('message', MessageController::class);
    Route::get('message/to-pdf/{id}', [MessageController::class, 'toPdf']);
    Route::apiResource('plan', PlanController::class);
    Route::apiResource('user-plan', UserPlanController::class);

    Route::group(['prefix' => 'deposition'], function () {
        Route::get('', 'App\Http\Controllers\DepositionController@index');
        Route::post('', 'App\Http\Controllers\DepositionController@store');
        Route::post('/{id}', 'App\Http\Controllers\DepositionController@update'); // método post por ser upload
        Route::delete('/{id}', 'App\Http\Controllers\DepositionController@destroy');
    });

    Route::group(['prefix' => 'right-area'], function () {
        Route::get('', 'App\Http\Controllers\RightAreaController@index');
        Route::post('', 'App\Http\Controllers\RightAreaController@store');
        Route::post('/{id}', 'App\Http\Controllers\RightAreaController@update'); // método post por ser upload
        Route::delete('/{id}', 'App\Http\Controllers\RightAreaController@destroy');
    });

    Route::apiResource('site-info', SiteInfoController::class);
    Route::apiResource('faq', FaqController::class);
});
