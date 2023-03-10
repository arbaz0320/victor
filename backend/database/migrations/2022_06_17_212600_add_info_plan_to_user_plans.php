<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInfoPlanToUserPlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            $table->decimal('price_year', 15, 2)->default(0)->after('price_month')->after('user_id');
            $table->decimal('price_month', 15, 2)->default(0)->after('period_in_days')->after('user_id');
            $table->integer('percentage_discount_contracts')->after('user_id');
            $table->integer('percentage_discount_questions')->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            //
        });
    }
}
