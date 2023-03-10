<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SiteInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'banner_title' => $this->banner_title,
            'banner_text' => $this->banner_text,
            'section1_title' => $this->section1_title,
            'section1_text' => $this->section1_text,
            'section2_title' => $this->section2_title,
            'section2_text' => $this->section2_text,
            'section3_title' => $this->section3_title,
            'section3_text' => $this->section3_text,
            'link_facebook' => $this->link_facebook,
            'link_instagram' => $this->link_instagram,
            'link_linkedin' => $this->link_linkedin,
            'address' => $this->address,
            'phone1' => $this->phone1,
            'phone2' => $this->phone2,
            'email' => $this->email,
            'counters_1' => $this->counters_1,
            'counters_2' => $this->counters_2,
            'counters_3' => $this->counters_3,
            'counters_4' => $this->counters_4,
            'term_text' => $this->term_text,
            'price_question' => $this->price_question,
        ];
    }
}
