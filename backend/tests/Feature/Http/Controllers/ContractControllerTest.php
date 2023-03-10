<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Contract;
use App\Models\Type;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ContractController
 */
class ContractControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $contracts = Contract::factory()->count(3)->create();

        $response = $this->get(route('contract.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractController::class,
            'store',
            \App\Http\Requests\ContractStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $title = $this->faker->sentence(4);
        $type = Type::factory()->create();

        $response = $this->post(route('contract.store'), [
            'title' => $title,
            'type_id' => $type->id,
        ]);

        $contracts = Contract::query()
            ->where('title', $title)
            ->where('type_id', $type->id)
            ->get();
        $this->assertCount(1, $contracts);
        $contract = $contracts->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $contract = Contract::factory()->create();

        $response = $this->get(route('contract.show', $contract));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractController::class,
            'update',
            \App\Http\Requests\ContractUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $contract = Contract::factory()->create();
        $title = $this->faker->sentence(4);
        $type = Type::factory()->create();

        $response = $this->put(route('contract.update', $contract), [
            'title' => $title,
            'type_id' => $type->id,
        ]);

        $contract->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($title, $contract->title);
        $this->assertEquals($type->id, $contract->type_id);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $contract = Contract::factory()->create();

        $response = $this->delete(route('contract.destroy', $contract));

        $response->assertNoContent();

        $this->assertDeleted($contract);
    }
}
