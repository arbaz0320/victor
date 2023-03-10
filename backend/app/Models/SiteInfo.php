<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform_description',
        'privacy_policies',
        'about_us',
        'banner_title',
        'banner_text',
        'section1_title',
        'section1_text',
        'section2_title',
        'section2_text',
        'section3_title',
        'section3_text',
        'link_facebook',
        'link_instagram',
        'link_linkedin',
        'address',
        'phone1',
        'phone2',
        'email',
        'counters_1',
        'counters_2',
        'counters_3',
        'counters_4',
        'term_text',
        'price_question',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'price_question' => 'float',
    ];
}
