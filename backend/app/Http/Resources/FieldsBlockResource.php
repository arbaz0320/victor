<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FieldsBlockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'contract_block_id' => $this->contract_block_id,
            'type' => $this->type,
            'mask' => $this->mask,
            'label' => $this->label,
            'position' => $this->position,
        ];
    }
}
