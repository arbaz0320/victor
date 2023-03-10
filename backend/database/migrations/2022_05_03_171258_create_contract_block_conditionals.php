<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractBlockConditionals extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contract_block_conditionals', function (Blueprint $table) {
            $table->id();

            $table->string('label');
            $table->text('question')->nullable();
            $table->text('description')->nullable();

            $table->longText('text')->nullable();

            $table->bigInteger('contract_block_id')->unsigned();
            $table->timestamps();

            $table->foreign('contract_block_id')->references('id')->on('contract_blocks')->onDelete('CASCADE')->onUpdate('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contract_block_conditionals');
    }
}
