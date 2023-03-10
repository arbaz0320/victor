<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\RoleController
 */
class RoleControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $roles = Role::factory()->count(3)->create();

        $response = $this->get(route('role.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\RoleController::class,
            'store',
            \App\Http\Requests\RoleStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $description = $this->faker->text;

        $response = $this->post(route('role.store'), [
            'description' => $description,
        ]);

        $roles = Role::query()
            ->where('description', $description)
            ->get();
        $this->assertCount(1, $roles);
        $role = $roles->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $role = Role::factory()->create();

        $response = $this->get(route('role.show', $role));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\RoleController::class,
            'update',
            \App\Http\Requests\RoleUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $role = Role::factory()->create();
        $description = $this->faker->text;

        $response = $this->put(route('role.update', $role), [
            'description' => $description,
        ]);

        $role->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($description, $role->description);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $role = Role::factory()->create();

        $response = $this->delete(route('role.destroy', $role));

        $response->assertNoContent();

        $this->assertDeleted($role);
    }
}
