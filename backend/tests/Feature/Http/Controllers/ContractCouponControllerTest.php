<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Contract;
use App\Models\ContractCoupon;
use App\Models\Coupon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ContractCouponController
 */
class ContractCouponControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $contractCoupons = ContractCoupon::factory()->count(3)->create();

        $response = $this->get(route('contract-coupon.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractCouponController::class,
            'store',
            \App\Http\Requests\ContractCouponStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $coupon = Coupon::factory()->create();
        $contract = Contract::factory()->create();

        $response = $this->post(route('contract-coupon.store'), [
            'coupon_id' => $coupon->id,
            'contract_id' => $contract->id,
        ]);

        $contractCoupons = ContractCoupon::query()
            ->where('coupon_id', $coupon->id)
            ->where('contract_id', $contract->id)
            ->get();
        $this->assertCount(1, $contractCoupons);
        $contractCoupon = $contractCoupons->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $contractCoupon = ContractCoupon::factory()->create();

        $response = $this->get(route('contract-coupon.show', $contractCoupon));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractCouponController::class,
            'update',
            \App\Http\Requests\ContractCouponUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $contractCoupon = ContractCoupon::factory()->create();
        $coupon = Coupon::factory()->create();
        $contract = Contract::factory()->create();

        $response = $this->put(route('contract-coupon.update', $contractCoupon), [
            'coupon_id' => $coupon->id,
            'contract_id' => $contract->id,
        ]);

        $contractCoupon->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($coupon->id, $contractCoupon->coupon_id);
        $this->assertEquals($contract->id, $contractCoupon->contract_id);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $contractCoupon = ContractCoupon::factory()->create();

        $response = $this->delete(route('contract-coupon.destroy', $contractCoupon));

        $response->assertNoContent();

        $this->assertDeleted($contractCoupon);
    }
}
