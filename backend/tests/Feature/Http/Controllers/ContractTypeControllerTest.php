<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ContractType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ContractTypeController
 */
class ContractTypeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $contractTypes = ContractType::factory()->count(3)->create();

        $response = $this->get(route('contract-type.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractTypeController::class,
            'store',
            \App\Http\Requests\ContractTypeStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $title = $this->faker->sentence(4);

        $response = $this->post(route('contract-type.store'), [
            'title' => $title,
        ]);

        $contractTypes = ContractType::query()
            ->where('title', $title)
            ->get();
        $this->assertCount(1, $contractTypes);
        $contractType = $contractTypes->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $contractType = ContractType::factory()->create();

        $response = $this->get(route('contract-type.show', $contractType));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractTypeController::class,
            'update',
            \App\Http\Requests\ContractTypeUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $contractType = ContractType::factory()->create();
        $title = $this->faker->sentence(4);

        $response = $this->put(route('contract-type.update', $contractType), [
            'title' => $title,
        ]);

        $contractType->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($title, $contractType->title);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $contractType = ContractType::factory()->create();

        $response = $this->delete(route('contract-type.destroy', $contractType));

        $response->assertNoContent();

        $this->assertDeleted($contractType);
    }
}
