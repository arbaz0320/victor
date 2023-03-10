<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'description', 'type', 'amount', 'id_transaction', 'status', 'used', 'user_id', 'contract_id', 'right_area_id',
    ];

    public function contract()
    {
        return $this->hasOne(Contract::class, 'id', 'contract_id');
    }

    public function rightArea()
    {
        return $this->hasOne(RightArea::class, 'id', 'right_area_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
