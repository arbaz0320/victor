<?php

namespace App\Tools;

class UtilTools
{

    public static function exceptionsErrors($message, $content = null)
    {
        return (object) array(
            'error' => true,
            'message' => $message,
            'content' => json_decode($content)
        );
    }
}
