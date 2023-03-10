<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFieldsBlocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('fields_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('question')->nullable();
            $table->text('description')->nullable();
            $table->string('type');
            $table->string('mask')->nullable();
            $table->integer('position')->default(0);
            $table->boolean('hide_answer')->default(0);

            $table->integer('condition_type')->nullable();
            $table->bigInteger('field_id')->nullable()->unsigned();
            $table->string('field_value')->nullable();

            $table->string('slug');
            $table->timestamps();

            $table->foreign('field_id')->references('id')->on('fields_blocks')->onDelete('SET NULL')->onUpdate('NO ACTION');
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
        Schema::dropIfExists('fields_blocks');
    }
}
