<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Contract;
use App\Models\ContractBlock;

class ContractBlockFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ContractBlock::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'contract_id' => Contract::factory(),
            'title' => $this->faker->sentence(4),
            'position' => $this->faker->numberBetween(1, 10),
        ];
    }
}
