<?php

namespace App\Http\Controllers;

use Illuminate\Http\{
    Request,
    Response
};
use App\Http\Requests\SiteInfoRequest;
use App\Models\SiteInfo;
use App\Http\Resources\SiteInfoResource;

/**
 * @OA\Tag(
 *     name="site-info",
 *     description="Informações do site"
 * )
 */
class SiteInfoController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"site-info"},
     *     summary="Lista todos os informações do site",
     *     description="Lista todos os informações do site",
     *     path="/api/site-info",
     *     @OA\Response(response="200", description="Lista todos os informações do site cadastradas"),
     * ),
     *
     */
    public function index()
    {
        $siteInfo = SiteInfo::first();
        return new SiteInfoResource($siteInfo);
    }

    public function store(SiteInfoRequest $request)
    {
        // $data = SiteInfo::create($request->validated());

        // return response()->json([
        //     'error' => !$data,
        //     'data' => $data ? $data : [],
        //     'message' => $data ? "Cadastrado" : "Erro cadastrar"
        // ], $data ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST);
    }

    public function show($id)
    {
        $deposition = SiteInfo::first();
        return new SiteInfoResource($deposition);
    }

    /**
     * @OA\Put(
     *   tags={"site-info"},
     *   path="/api/site-info",
     *   summary="Edita as informações do site",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="banner_title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="banner_text",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="section1_title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="section1_text",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="section2_title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="section2_text",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="section3_title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="section3_text",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="link_facebook",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="link_instagram",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="link_linkedin",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="address",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="phone1",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="phone2",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="email",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="term_text",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(SiteInfoRequest $request, $id)
    {
        $siteInfo = SiteInfo::first();

        if (!$siteInfo) {
            return $this->returnIfNotExist();
        }

        $data = $request->validated();
        $links = ['facebook', 'instagram', 'linkedin'];
        foreach ($links as $link) {
            $url = preg_replace("#^[^:.]*[:]+\/\/#i", "", $data['link_' . $link]);
            $data['link_' . $link] = 'https://' . $url;
        }
        $siteInfo->update($data);

        return response()->json([
            'error'   => !$siteInfo,
            'data'    => $siteInfo ? $siteInfo : [],
            'message' => $siteInfo ? 'Atualizado' : 'Erro ao atualizar',
        ], $siteInfo ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    private function returnIfNotExist()
    {
        return response()->json([
            'error' => true,
            'data' => [],
            'message' => 'Informações não encontradas'
        ], Response::HTTP_BAD_REQUEST);
    }
}
