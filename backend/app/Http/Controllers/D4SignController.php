<?php

namespace App\Http\Controllers;

use App\Services\D4Sign\D4SignService;
use Illuminate\Http\Request;

class D4SignController extends Controller
{
    public function __invoke()
    {
        ( new D4SignService() )->getSafe();
    }
}
