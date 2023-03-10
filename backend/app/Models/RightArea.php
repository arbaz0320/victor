<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class RightArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image'
    ];

    protected $appends = [
        'price'
    ];

    public function getImageAttribute()
    {
        if ($this->attributes['image']) {
            return url('api/public/storage/rightAreas/' . $this->attributes['image']);
        }
        return null;
    }

    public function getPriceAttribute()
    {
        return SiteInfo::first()->price_question ?? 0;
    }
}
