<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\ContractGenerated;
use App\Models\User;
use App\Models\Order;

class ContractGeneratedFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ContractGenerated::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'signed' => $this->faker->boolean,
            'order_id' => Order::factory(),
        ];
    }
}
