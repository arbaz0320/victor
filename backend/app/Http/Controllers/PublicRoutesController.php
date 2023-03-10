<?php

namespace App\Http\Controllers;

use App\Http\Repositories\UserRepository;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\{
    Contract,
    Faq,
    Plan,
    RightArea,
    User
};
use Illuminate\Support\Facades\Notification;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\ContactNotification;
use Illuminate\Http\{
    Request,
    Response
};
use Illuminate\Support\Str;

/**
 * @OA\Tag(
 *     name="public-routes",
 *     description="Rotas públicas"
 * )
 */
class PublicRoutesController extends Controller
{
    /**
     * TODO: Boa tarde
     * @OA\Get(
     *   tags={"Tag"},
     *   path="Path",
     *   summary="Summary",
     *   @OA\Parameter(ref="#/components/parameters/id"),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=401, description="Unauthorized"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    /**
     * @OA\Get(
     *     tags={"public-routes"},
     *     summary="Planos públicos",
     *     description="Planos públicos",
     *     path="/api/public-routes/plan",
     *     @OA\Response(response="200", description="Lista todos os planos em modo público"),
     * ),
     *
     */
    public function plan(Request $request)
    {
        $plan = new Plan();
        return (new PlanController($plan))->index($request, true);
    }

    /**
     * @OA\Post(
     *     tags={"public-routes"},
     *     summary="Contratos públicos",
     *     description="Contratos públicos",
     *     path="/api/public-routes/contract",
     *     @OA\Response(response="200", description="Lista todos os comtratos em modo público"),
     * ),
     *
     */
    public function contract(Request $request)
    {
        $contract = new Contract();
        return (new ContractController($contract))->store($request);
    }

    /**
     * @OA\Post(
     *     tags={"public-routes"},
     *     summary="Cadastro de usuário em modo público",
     *     description="Cadastro de usuário em modo público",
     *     path="/api/public-routes/user",
     *     @OA\Response(response="200", description="Cadastro de usuário em modo público"),
     * ),
     *
     */
    public function user(UserStoreRequest $request)
    {
        $user = new UserRepository();
        return (new UserController($user))->store($request);
    }

    /**
     * @OA\Get(
     *     tags={"public-routes"},
     *     summary="Lista depoimentos em modo público",
     *     description="Lista depoimentos em modo público",
     *     path="/api/public-routes/deposition",
     *     @OA\Response(response="200", description="Lista depoimentos em modo público"),
     * ),
     *
     */
    public function deposition()
    {
        return (new DepositionController())->index();
    }

    /**
     * @OA\Get(
     *     tags={"public-routes"},
     *     summary="Lista os direitos em modo público",
     *     description="Lista os direitos em modo público",
     *     path="/api/public-routes/right-area",
     *     @OA\Response(response="200", description="Lista os direitos em modo público"),
     * ),
     *
     */
    public function rights()
    {
        $response = (new RightAreaController())->index()->toArray();
        $area = new RightArea;
        $area->id = -1;
        $area->title = 'Outros';
        $area->description = 'Tem alguma outra dúvida fora das área citadas, não exite em tira-la.';
        $response['data'][] = $area->toArray();
        return $response;
    }

    /**
     * @OA\Get(
     *     tags={"public-routes"},
     *     summary="Lista as informações do site em modo público",
     *     description="Lista as informações do site em modo público",
     *     path="/api/public-routes/site-info",
     *     @OA\Response(response="200", description="Lista as informações do site em modo público"),
     * ),
     *
     */
    public function siteInfo()
    {
        return (new SiteInfoController())->index();
    }

    /**
     * @OA\Get(
     *     tags={"public-routes"},
     *     summary="Lista os contratos em modo público",
     *     description="Lista os contratos em modo público",
     *     path="/api/public-routes/contract",
     *     @OA\Response(response="200", description="Lista os contratos em modo público"),
     * ),
     *
     */
    public function contracts(Request $request)
    {
        $contract = new Contract();
        return (new ContractController($contract))->index($request, true);
    }

    /**
     * @OA\Get(
     *     tags={"public-routes"},
     *     summary="Lista as informações de um determinado contrato em modo público",
     *     description="Lista as informações de um determinado contrato em modo público",
     *     path="/api/public-routes/contract/{id}",
     *     @OA\Response(response="200", description="Lista as informações de um determinado contrato em modo público"),
     * ),
     *
     */
    public function contractShow(Request $request, $id)
    {
        $contract = new Contract();
        return (new ContractController($contract))->show($request, $id);
    }

    public function storeContract(Request $request)
    {
        (new ContractGeneratedController())->store($request);
    }

    /**
     * @OA\Get(
     *     tags={"public-routes"},
     *     summary="Listas todos os FAQ em modo público",
     *     description="Listas todos os FAQ em modo público",
     *     path="/api/public-routes/contract/{id}",
     *     @OA\Response(response="200", description="Listas todos os FAQ em modo público"),
     * ),
     *
     */
    public function faq(Request $request)
    {
        $faq = new Faq();
        return (new FaqController($faq))->index($request);
    }

    /*
    *  Disparo de e-mail do formulário de contato presente no site
    */
    public function contact(Request $request)
    {
        Notification::route('mail', [
            env("MAIL_TO_ADDRESS") => env("MAIL_TO_NAME")
        ])->notify(
            new ContactNotification($request['name'], $request['email'], $request['subject'], $request['message'])
        );

        return response()->json([
            'error'   => false,
            'message' => 'E-mail enviado'
        ], Response::HTTP_OK);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $request->validated();

        DB::beginTransaction();
        try {
            $newPassword = Str::random(6);

            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($newPassword);
            $user->save();

            $user->notify(
                new ResetPasswordNotification($newPassword)
            );

            DB::commit();

            return response()->json([
                'error'   => false,
                'message' => "Nova senha enviada para o e-mail {$request->email}"
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error'   => true,
                'message' => "Erro ao enviar e-mail"
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
