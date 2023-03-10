<?php

namespace App\Http\Controllers;

use App\Http\Requests\{
    RightAreaStoreRequest,
    RighAreaUpdateRequest
};
use App\Models\RightArea;
use App\Http\Resources\RightAreaResource;
use Illuminate\Http\{
    Request,
    Response
};

/**
 * @OA\Tag(
 *     name="right-area",
 *     description="Direitos da área de direitos no site"
 * )
 */
class RightAreaController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"right-area"},
     *     summary="Lista todos os direitos",
     *     description="Lista todos os direitos",
     *     path="/api/right-area",
     *     @OA\Response(response="200", description="Lista todos os direitos cadastrados"),
     * ),
     *
     */
    public function index()
    {
        return RightArea::orderBy('created_at', 'DESC')->paginate(10);
    }

    /**
     * @OA\Post(
     *   tags={"right-area"},
     *   path="/api/right-area",
     *   summary="Cadastra um novo direito na área de direitos no site",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="description",
     *            type="text",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(RightAreaStoreRequest $request)
    {
        $request->validated();

        $data = RightArea::create($request->only([
            'title',
            'description'
        ]));

        if (!empty($request->avatar)) {
            $imageName = $this->uploadFile($request->avatar);
            $data->update(['image' => $imageName]);
        }

        return response()->json([
            'error' => !$data,
            'data' => $data ? $data : [],
            'message' => $data ? "Cadastrado" : "Erro cadastrar"
        ], $data ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *   tags={"right-area"},
     *   path="/api/right-area/{id}",
     *   summary="Exibe um direito da área de direitos do site",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function show($id)
    {
        $deposition = RightArea::find($id);

        if (!$deposition) {
            return $this->returnIfNotExist();
        }

        return new RightAreaResource($deposition);
    }

    /**
     * @OA\Post(
     *   tags={"right-area"},
     *   path="/api/right-area/{id}",
     *   summary="Edita um direito na área de direitos no site",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="description",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="image",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(RighAreaUpdateRequest $request, $id)
    {
        $rightArea = RightArea::find($id);

        if (!$rightArea) {
            return $this->returnIfNotExist();
        }

        $oldFile = $rightArea->getRawOriginal('image');
        $request->validated();

        $rightArea = $rightArea->update($request->only([
            'title',
            'description'
        ]));

        if (!empty($request->avatar)) {
            $imageName = $this->uploadFile($request->avatar);
            $rightArea = RightArea::find($id);
            $rightArea->update(['image' => $imageName]);
            $this->deleteFile($oldFile);
        }

        return response()->json([
            'error'   => !$rightArea,
            'data'    => $rightArea ? $rightArea : [],
            'message' => $rightArea ? 'Atualizado' : 'Erro ao atualizar',
        ], $rightArea ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    /**
     * @OA\Delete(
     *   tags={"right-area"},
     *   path="/api/right-area/{id}",
     *   summary="Remove um elemento da área de direitos",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy($id)
    {
        $rightArea = RightArea::find($id);

        if (!$rightArea) {
            return $this->returnIfNotExist();
        }

        $rightArea = $rightArea->delete();

        return response()->json([
            'error'   => !$rightArea,
            'message' => $rightArea ? 'Removido' : 'Erro ao remover',
        ], $rightArea ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    private function uploadFile($file)
    {
        $imageName = time() . "." . $file->extension();
        $file->storeAs('public/rightAreas', $imageName);

        return $imageName;
    }

    private function deleteFile($file)
    {
        try {
            $filePath = "app/public/rightAreas/" . $file;

            if (file_exists(storage_path($filePath))) {
                unlink(storage_path($filePath));
            }
        } catch (\Exception $e) {
        }
    }

    private function returnIfNotExist()
    {
        return response()->json([
            'error' => true,
            'message' =>
            'Informações não encontradas'
        ], Response::HTTP_BAD_REQUEST);
    }
}
