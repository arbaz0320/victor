<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ContractBlock;
use App\Models\FieldsBlock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\FieldsBlockController
 */
class FieldsBlockControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $fieldsBlocks = FieldsBlock::factory()->count(3)->create();

        $response = $this->get(route('fields-block.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\FieldsBlockController::class,
            'store',
            \App\Http\Requests\FieldsBlockStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $contract_block = ContractBlock::factory()->create();
        $type = $this->faker->word;
        $label = $this->faker->word;
        $position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->post(route('fields-block.store'), [
            'contract_block_id' => $contract_block->id,
            'type' => $type,
            'label' => $label,
            'position' => $position,
        ]);

        $fieldsBlocks = FieldsBlock::query()
            ->where('contract_block_id', $contract_block->id)
            ->where('type', $type)
            ->where('label', $label)
            ->where('position', $position)
            ->get();
        $this->assertCount(1, $fieldsBlocks);
        $fieldsBlock = $fieldsBlocks->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $fieldsBlock = FieldsBlock::factory()->create();

        $response = $this->get(route('fields-block.show', $fieldsBlock));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\FieldsBlockController::class,
            'update',
            \App\Http\Requests\FieldsBlockUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $fieldsBlock = FieldsBlock::factory()->create();
        $contract_block = ContractBlock::factory()->create();
        $type = $this->faker->word;
        $label = $this->faker->word;
        $position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->put(route('fields-block.update', $fieldsBlock), [
            'contract_block_id' => $contract_block->id,
            'type' => $type,
            'label' => $label,
            'position' => $position,
        ]);

        $fieldsBlock->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($contract_block->id, $fieldsBlock->contract_block_id);
        $this->assertEquals($type, $fieldsBlock->type);
        $this->assertEquals($label, $fieldsBlock->label);
        $this->assertEquals($position, $fieldsBlock->position);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $fieldsBlock = FieldsBlock::factory()->create();

        $response = $this->delete(route('fields-block.destroy', $fieldsBlock));

        $response->assertNoContent();

        $this->assertDeleted($fieldsBlock);
    }
}
