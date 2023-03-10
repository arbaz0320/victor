<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFieldsOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fields_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('field_id')->constrained('fields_blocks');
            $table->string('label');
            $table->integer('status')->default(1);
            $table->timestamps();

            Schema::enableForeignKeyConstraints();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fields_options');
    }
}
