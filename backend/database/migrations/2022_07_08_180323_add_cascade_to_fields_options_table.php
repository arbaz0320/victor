<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCascadeToFieldsOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fields_options', function (Blueprint $table) {
            $table->dropForeign('fields_options_field_id_foreign');
            $table->foreign('field_id')
                ->references('id')
                ->on('fields_blocks')
                ->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fields_options', function (Blueprint $table) {
            //
        });
    }
}
