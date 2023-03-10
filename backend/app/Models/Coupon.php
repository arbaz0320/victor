<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    const COUPON_TYPE = [
        'MOEDA'      => 1,
        'PERCENTUAL' => 2
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'value',
        'discount_type',
        'status',
        'expire_at',
        'user_id',
    ];

    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = strtoupper($value);
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'value' => 'float',
        // 'expire_at' => 'datetime',
    ];
}
