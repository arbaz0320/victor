<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ContractGenerated;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ContractGeneratedController
 */
class ContractGeneratedControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $contractGenerateds = ContractGenerated::factory()->count(3)->create();

        $response = $this->get(route('contract-generated.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractGeneratedController::class,
            'store',
            \App\Http\Requests\ContractGeneratedStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $user = User::factory()->create();
        $signed = $this->faker->boolean;

        $response = $this->post(route('contract-generated.store'), [
            'user_id' => $user->id,
            'signed' => $signed,
        ]);

        $contractGenerateds = ContractGenerated::query()
            ->where('user_id', $user->id)
            ->where('signed', $signed)
            ->get();
        $this->assertCount(1, $contractGenerateds);
        $contractGenerated = $contractGenerateds->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $contractGenerated = ContractGenerated::factory()->create();

        $response = $this->get(route('contract-generated.show', $contractGenerated));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractGeneratedController::class,
            'update',
            \App\Http\Requests\ContractGeneratedUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $contractGenerated = ContractGenerated::factory()->create();
        $user = User::factory()->create();
        $signed = $this->faker->boolean;

        $response = $this->put(route('contract-generated.update', $contractGenerated), [
            'user_id' => $user->id,
            'signed' => $signed,
        ]);

        $contractGenerated->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($user->id, $contractGenerated->user_id);
        $this->assertEquals($signed, $contractGenerated->signed);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $contractGenerated = ContractGenerated::factory()->create();

        $response = $this->delete(route('contract-generated.destroy', $contractGenerated));

        $response->assertNoContent();

        $this->assertDeleted($contractGenerated);
    }
}
