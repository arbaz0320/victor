<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldsBlock extends Model
{
    use HasFactory, Sluggable;

    protected $table = "fields_blocks";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'question', 'description', 'type', 'mask', 'position', 'hide_answer', 'required', 'condition_type', 'field_id', 'field_value', 'slug',
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

    public function options()
    {
        return $this->hasMany(FieldsOption::class, 'field_id', 'id');
    }

    public function depends()
    {
        return $this->hasMany(FieldsBlock::class, 'field_id', 'id');
    }

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'slug_field'
            ]
        ];
    }

    public function getSlugFieldAttribute(): string
    {
        return "{$this->title}_field";
    }
}
