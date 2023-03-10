<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    const STATUS_ACTIVED = 1;

    protected $fillable = [
        'name',
        'description',
        'period_in_days',
        'price_month',
        'price_year',
        'percentage_discount_questions',
        'percentage_discount_contracts',
        'status',
        'mp_month_id',
        'mp_year_id',
        'recommended'
    ];

    protected $casts = [
        'price_month' => 'integer',
        'price_year' => 'integer',
        'percentage_discount_questions' => 'integer',
        'percentage_discount_contracts' => 'integer'
    ];

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public static function geraDesconto($amount, $discount)
    {
        $amount = floatval($amount);
        $discount = floatval($discount);
        $newAmount = $amount - ($amount * ($discount / 100));
        return $newAmount;
    }
}
