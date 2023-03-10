<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\ContractBlock;
use App\Models\FieldsBlock;

class FieldsBlockFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FieldsBlock::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'contract_block_id' => ContractBlock::factory(),
            'type' => $this->faker->word,
            'mask' => $this->faker->word,
            'label' => $this->faker->word,
            'position' => $this->faker->numberBetween(1, 10),
        ];
    }
}
