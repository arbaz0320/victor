<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            // ContractTypeSeeder::class,
            // MessageSeeder::class,
            // FieldsBlockSeeder::class,
            // CouponSeeder::class,
            // ContractSeeder::class,
            // ContractGeneratedSeeder::class,
            // ContractBlockSeeder::class,
            // ContractCouponSeeder::class,
        ]);
    }
}
