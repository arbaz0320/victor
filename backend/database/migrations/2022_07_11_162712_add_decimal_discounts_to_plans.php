<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDecimalDiscountsToPlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->decimal('percentage_discount_questions', 15, 2)->change();
            $table->decimal('percentage_discount_contracts', 15, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->integer('percentage_discount_questions')->change();
            $table->integer('percentage_discount_contracts')->change();
        });
    }
}
