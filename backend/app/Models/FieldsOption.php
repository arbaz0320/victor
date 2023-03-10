<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldsOption extends Model
{
    use HasFactory;

    protected $table = "fields_options";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'field_id', 'label', 'status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'field_id' => 'integer',
    ];


    public function contractBlock()
    {
        return $this->belongsTo(\App\Models\ContractBlock::class);
    }
}
