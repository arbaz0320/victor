<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractSignatories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contract_signatories', function (Blueprint $table) {
            $table->id();

            $table->enum('type', ['parte', 'testemunha', 'fiador']);
            $table->string('question');
            $table->string('description')->nullable();

            $table->bigInteger('contract_id')->unsigned()->nullable();
            $table->foreign('contract_id')
                ->references('id')
                ->on('contracts')
                ->onDelete('CASCADE')
                ->onUpdate('NO ACTION');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('constract_signatories');
    }
}
