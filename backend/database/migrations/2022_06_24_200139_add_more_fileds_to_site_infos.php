<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMoreFiledsToSiteInfos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('site_infos', function (Blueprint $table) {
            $table->string('platform_description')->after('id');
            $table->string('privacy_policies')->after('platform_description');
            $table->string('about_us')->after('privacy_policies');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('site_infos', function (Blueprint $table) {
            //
        });
    }
}
