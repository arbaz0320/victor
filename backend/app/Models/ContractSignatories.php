<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractSignatories extends Model
{
    use HasFactory;

    protected $table = "contract_signatories";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type', 'question', 'description', 'contract_id',
    ];
}
