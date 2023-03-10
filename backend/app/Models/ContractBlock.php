<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractBlock extends Model
{
    use HasFactory, Sluggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'modo', 'question', 'description', 'condition_type', 'field_id', 'field_value', 'position', 'slug',
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


    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'slug_block'
            ]
        ];
    }

    protected $appends = ['type'];

    public function getTypeAttribute()
    {
        return $this->type = "block";
    }

    public function getSlugBlockAttribute(): string
    {
        return "{$this->title}_block";
    }

    public function conditionals()
    {
        return $this->hasMany(\App\Models\ContractConditional::class, 'contract_block_id', 'id');
    }

    public function field()
    {
        return $this->hasOne(\App\Models\FieldsBlock::class, 'id', 'field_id');
    }
}
