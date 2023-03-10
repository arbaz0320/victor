<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractConditional extends Model
{
    use HasFactory;

    protected $table = "contract_block_conditionals";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'label', 'question', 'description', 'text', 'contract_block_id',
    ];

    // public function contract()
    // {
    //     return $this->belongsTo(\App\Models\Contract::class);
    // }
}
