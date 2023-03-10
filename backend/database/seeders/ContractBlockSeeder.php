<?php

namespace Database\Seeders;

use App\Models\ContractBlock;
use Illuminate\Database\Seeder;

class ContractBlockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ContractBlock::factory()->count(5)->create();
    }
}
