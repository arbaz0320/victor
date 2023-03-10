<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnIdTransactionInUsersPlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            $table->string('plan_type')->after('expire_at')->nullable();
            $table->string('id_transaction')->after('plan_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users_plans', function (Blueprint $table) {
            //
        });
    }
}
