<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\MessageController
 */
class MessageControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $messages = Message::factory()->count(3)->create();

        $response = $this->get(route('message.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MessageController::class,
            'store',
            \App\Http\Requests\MessageStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $message = $this->faker->text;

        $response = $this->post(route('message.store'), [
            'message' => $message,
        ]);

        $messages = Message::query()
            ->where('message', $message)
            ->get();
        $this->assertCount(1, $messages);
        $message = $messages->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $message = Message::factory()->create();

        $response = $this->get(route('message.show', $message));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\MessageController::class,
            'update',
            \App\Http\Requests\MessageUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $message = Message::factory()->create();
        $message = $this->faker->text;

        $response = $this->put(route('message.update', $message), [
            'message' => $message,
        ]);

        $message->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($message, $message->message);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $message = Message::factory()->create();

        $response = $this->delete(route('message.destroy', $message));

        $response->assertNoContent();

        $this->assertDeleted($message);
    }
}
