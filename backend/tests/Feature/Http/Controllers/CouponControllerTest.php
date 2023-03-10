<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CouponController
 */
class CouponControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $coupons = Coupon::factory()->count(3)->create();

        $response = $this->get(route('coupon.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CouponController::class,
            'store',
            \App\Http\Requests\CouponStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $title = $this->faker->sentence(4);
        $value = $this->faker->randomFloat(/** float_attributes **/);
        $discount_type = $this->faker->numberBetween(-10000, 10000);
        $expire_at = $this->faker->dateTime();

        $response = $this->post(route('coupon.store'), [
            'title' => $title,
            'value' => $value,
            'discount_type' => $discount_type,
            'expire_at' => $expire_at,
        ]);

        $coupons = Coupon::query()
            ->where('title', $title)
            ->where('value', $value)
            ->where('discount_type', $discount_type)
            ->where('expire_at', $expire_at)
            ->get();
        $this->assertCount(1, $coupons);
        $coupon = $coupons->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $coupon = Coupon::factory()->create();

        $response = $this->get(route('coupon.show', $coupon));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CouponController::class,
            'update',
            \App\Http\Requests\CouponUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $coupon = Coupon::factory()->create();
        $title = $this->faker->sentence(4);
        $value = $this->faker->randomFloat(/** float_attributes **/);
        $discount_type = $this->faker->numberBetween(-10000, 10000);
        $expire_at = $this->faker->dateTime();

        $response = $this->put(route('coupon.update', $coupon), [
            'title' => $title,
            'value' => $value,
            'discount_type' => $discount_type,
            'expire_at' => $expire_at,
        ]);

        $coupon->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($title, $coupon->title);
        $this->assertEquals($value, $coupon->value);
        $this->assertEquals($discount_type, $coupon->discount_type);
        $this->assertEquals($expire_at, $coupon->expire_at);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $coupon = Coupon::factory()->create();

        $response = $this->delete(route('coupon.destroy', $coupon));

        $response->assertNoContent();

        $this->assertDeleted($coupon);
    }
}
