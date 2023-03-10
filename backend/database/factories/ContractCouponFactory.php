<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Contract;
use App\Models\ContractCoupon;
use App\Models\Coupon;

class ContractCouponFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ContractCoupon::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'coupon_id' => Coupon::factory(),
            'contract_id' => Contract::factory(),
        ];
    }
}
