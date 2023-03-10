<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnIdDocumentInContractsGenerateds extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contract_generateds', function (Blueprint $table) {
            $table->string('document_id')->nullable()->after('order_id');
            $table->text('webhook')->nullable()->after('document_id');
            $table->text('signatories')->nullable()->after('webhook');
            $table->text('url_document')->nullable()->after('signatories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts_generateds', function (Blueprint $table) {
            //
        });
    }
}
