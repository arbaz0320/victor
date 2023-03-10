<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role = Role::create(['description' => 'ADMIN']);
        User::create([
            'name' => 'Deploy',
            'email' => 'deploy@devio.com.br',
            'password' => bcrypt('1234'),
            'role_id' => $role->id,
            'active' => 1
        ]);
    }
}
