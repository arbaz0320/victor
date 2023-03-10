<?php

namespace Database\Seeders;

use App\Models\ContractCoupon;
use Illuminate\Database\Seeder;

class ContractCouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ContractCoupon::factory()->count(5)->create();
    }
}
