<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->enum('type', ['question', 'contract']);
            $table->decimal('amount', 10, 2);
            $table->string('id_transaction')->nullable();
            $table->string('status');
            $table->enum('used', ['yes', 'not']);

            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('contract_id')->unsigned()->nullable();
            $table->bigInteger('right_area_id')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('CASCADE')
                ->onUpdate('NO ACTION');

            $table->foreign('contract_id')
                ->references('id')
                ->on('contracts')
                ->onDelete('SET NULL')
                ->onUpdate('NO ACTION');

            $table->foreign('right_area_id')
                ->references('id')
                ->on('right_areas')
                ->onDelete('SET NULL')
                ->onUpdate('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
