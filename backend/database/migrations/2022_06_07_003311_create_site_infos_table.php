<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSiteInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('site_infos', function (Blueprint $table) {
            $table->id();
            $table->string('banner_title');
            $table->string('banner_text');

            $table->string('section1_title');
            $table->text('section1_text');

            $table->string('section2_title');
            $table->text('section2_text');

            $table->string('section3_title');
            $table->text('section3_text');

            $table->string('link_facebook');
            $table->string('link_instagram');
            $table->string('link_linkedin');

            $table->string('address');
            $table->string('phone1')->nullable();
            $table->string('phone2')->nullable();
            $table->string('email');

            $table->smallInteger('counters_1');
            $table->smallInteger('counters_2');
            $table->smallInteger('counters_3');
            $table->smallInteger('counters_4');

            $table->longText('term_text');
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
        Schema::dropIfExists('site_infos');
    }
}
