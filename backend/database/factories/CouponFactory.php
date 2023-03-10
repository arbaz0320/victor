<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Coupon;

class CouponFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Coupon::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(4),
            'value' => $this->faker->randomFloat(0, 0, 9999.),
            'discount_type' => $this->faker->numberBetween(1, 10),
            'expire_at' => $this->faker->dateTime(),
        ];
    }
}
