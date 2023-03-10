<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'description', 'text', 'type_id', 'price', 'signatures_number', 'status', 'presentation_path'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'type_id' => 'integer',
        'price' => 'integer'
    ];

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }


    public function type()
    {
        return $this->belongsTo(\App\Models\ContractType::class);
    }

    public function contract_blocks()
    {
        return $this->hasOne(\App\Models\ContractConditional::class, 'contract_block_id', 'id');
    }

    public function signatories()
    {
        return $this->hasMany(ContractSignatories::class, 'contract_id', 'id');
    }
}
