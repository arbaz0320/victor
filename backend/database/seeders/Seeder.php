<?php

namespace Database\Seeders;

use App\Models\;
use Illuminate\Database\Seeder;

class Seeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Models::factory()->count(5)->create();
    }
}
