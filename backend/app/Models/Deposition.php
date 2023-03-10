<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Deposition extends Model
{
    use HasFactory;

    protected $fillable = [
        'author',
        'description',
        'role',
        'avatar'
    ];

    public function getAvatarAttribute()
    {
        if ($this->attributes['avatar']) {
            return url('api/public/storage/depositions/' . $this->attributes['avatar']);
        }
        return null;
    }
}
