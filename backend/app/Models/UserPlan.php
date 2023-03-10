<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id', 'user_id', 'percentage_discount_questions', 'percentage_discount_contracts',
        'price_month', 'price_year', 'expire_at', 'plan_type', 'id_transaction',
    ];

    protected $with = [
        'plan'
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'id', 'user_id');
    }
    public function plan()
    {
        return $this->hasOne(\App\Models\Plan::class, 'id', 'plan_id');
    }
}
