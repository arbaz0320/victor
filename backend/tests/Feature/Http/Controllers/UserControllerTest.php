<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\UserController
 */
class UserControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $users = User::factory()->count(3)->create();

        $response = $this->get(route('user.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\UserController::class,
            'store',
            \App\Http\Requests\UserStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $email = $this->faker->safeEmail;
        $password = $this->faker->password;
        $role = Role::factory()->create();
        $active = $this->faker->boolean;

        $response = $this->post(route('user.store'), [
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role_id' => $role->id,
            'active' => $active,
        ]);

        $users = User::query()
            ->where('name', $name)
            ->where('email', $email)
            ->where('password', $password)
            ->where('role_id', $role->id)
            ->where('active', $active)
            ->get();
        $this->assertCount(1, $users);
        $user = $users->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $user = User::factory()->create();

        $response = $this->get(route('user.show', $user));

        $response->assertNoContent();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\UserController::class,
            'update',
            \App\Http\Requests\UserStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $user = User::factory()->create();
        $name = $this->faker->name;
        $email = $this->faker->safeEmail;
        $password = $this->faker->password;
        $role = Role::factory()->create();
        $active = $this->faker->boolean;

        $response = $this->put(route('user.update', $user), [
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role_id' => $role->id,
            'active' => $active,
        ]);

        $user->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $user->name);
        $this->assertEquals($email, $user->email);
        $this->assertEquals($password, $user->password);
        $this->assertEquals($role->id, $user->role_id);
        $this->assertEquals($active, $user->active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $user = User::factory()->create();

        $response = $this->delete(route('user.destroy', $user));

        $response->assertNoContent();

        $this->assertDeleted($user);
    }
}
