<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractBlocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('contract_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('question')->nullable();
            $table->text('description')->nullable();

            $table->integer('condition_type')->nullable();
            $table->string('field_id')->nullable();
            $table->string('field_value')->nullable();
            $table->integer('position')->default(0);
            $table->string('slug');
            $table->timestamps();
        });

        // Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contract_blocks');
    }
}
