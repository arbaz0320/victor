<?php

namespace Database\Seeders;

use App\Models\FieldsBlock;
use Illuminate\Database\Seeder;

class FieldsBlockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        FieldsBlock::factory()->count(5)->create();
    }
}
