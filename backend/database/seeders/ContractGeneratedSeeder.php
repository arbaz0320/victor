<?php

namespace Database\Seeders;

use App\Models\ContractGenerated;
use Illuminate\Database\Seeder;

class ContractGeneratedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ContractGenerated::factory()->count(5)->create();
    }
}
