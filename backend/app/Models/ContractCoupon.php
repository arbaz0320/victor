<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractCoupon extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'coupon_id',
        'contract_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'coupon_id' => 'integer',
        'contract_id' => 'integer',
    ];


    public function coupon()
    {
        return $this->belongsTo(\App\Models\Coupon::class);
    }

    public function contract()
    {
        return $this->belongsTo(\App\Models\Contract::class);
    }
}
