<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'message_id', 'message', 'pergunta', 'resposta', 'read', 'status', 'order_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'read' => 'boolean',
        'order_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
    public function order()
    {
        return $this->belongsTo(\App\Models\Order::class);
    }

    public function messageDefault()
    {
        return $this->hasOne(\App\Models\Message::class, 'id', 'message_id');
    }
    public function messages()
    {
        return $this->hasMany(\App\Models\Message::class, 'message_id', 'id');
    }
}
