<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class apiProtectedRoute extends BaseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {

            if ($e instanceof TokenInvalidException) {
                return response()->json(['message' => 'Token is invalid'], Response::HTTP_FORBIDDEN);
            } elseif ($e instanceof TokenExpiredException) {
                return response()->json(['message' => 'Token expired'], Response::HTTP_FORBIDDEN);
            } else {
                return response()->json(['message' => 'Authorization token not found'], Response::HTTP_FORBIDDEN);
            }

        }

        return $next($request);

    }
}
