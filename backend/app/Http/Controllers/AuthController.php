<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\User;

/**
 * @OA\Tag(
 *     name="auth",
 *     description="Autorização"
 * )
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *   tags={"auth"},
     *   path="/api/auth",
     *   summary="Login",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="email",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="password",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (isset($request->origin) && $request->origin == 'admin') {
            $credentials['role_id'] = 1;
        }

        $eightHours = 480;
        auth()->factory()->setTTL($eightHours);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['erro' => true, 'message' => 'Usuário e/ou senha inválidos'], Response::HTTP_NOT_FOUND);
        }

        if (!auth()->user()->active) {
            return response()->json(['error' => true, 'message' => 'Usuário Inativo'], Response::HTTP_NOT_FOUND);
        }

        return $this->respondWithToken($token);
    }

    /**
     * @OA\Get(
     *   tags={"auth"},
     *   path="/api/auth/has-user",
     *   summary="Verifica se o usuário existe ou não",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function hasUser(Request $request)
    {
        $ret = ['exists' => false];
        $user = User::where('email', $request->email)->first();
        if ($user && $user->active) {
            $ret['exists'] = true;
        }
        return response()->json($ret);
    }

    /**
     * @OA\Get(
     *   tags={"auth"},
     *   path="/api/auth/me",
     *   summary="Exibe informações do usuário logado",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out'], Response::HTTP_OK);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
