<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Contract;
use App\Models\ContractBlock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ContractBlockController
 */
class ContractBlockControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $contractBlocks = ContractBlock::factory()->count(3)->create();

        $response = $this->get(route('contract-block.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractBlockController::class,
            'store',
            \App\Http\Requests\ContractBlockStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $contract = Contract::factory()->create();
        $title = $this->faker->sentence(4);
        $position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->post(route('contract-block.store'), [
            'contract_id' => $contract->id,
            'title' => $title,
            'position' => $position,
        ]);

        $contractBlocks = ContractBlock::query()
            ->where('contract_id', $contract->id)
            ->where('title', $title)
            ->where('position', $position)
            ->get();
        $this->assertCount(1, $contractBlocks);
        $contractBlock = $contractBlocks->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $contractBlock = ContractBlock::factory()->create();

        $response = $this->get(route('contract-block.show', $contractBlock));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContractBlockController::class,
            'update',
            \App\Http\Requests\ContractBlockUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $contractBlock = ContractBlock::factory()->create();
        $contract = Contract::factory()->create();
        $title = $this->faker->sentence(4);
        $position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->put(route('contract-block.update', $contractBlock), [
            'contract_id' => $contract->id,
            'title' => $title,
            'position' => $position,
        ]);

        $contractBlock->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($contract->id, $contractBlock->contract_id);
        $this->assertEquals($title, $contractBlock->title);
        $this->assertEquals($position, $contractBlock->position);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $contractBlock = ContractBlock::factory()->create();

        $response = $this->delete(route('contract-block.destroy', $contractBlock));

        $response->assertNoContent();

        $this->assertDeleted($contractBlock);
    }
}
