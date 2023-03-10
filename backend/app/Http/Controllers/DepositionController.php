<?php

namespace App\Http\Controllers;

use App\Models\Deposition;
use Illuminate\Http\{
    Request,
    Response
};
use App\Http\Requests\DepositionRequest;
use App\Http\Resources\DepositionResource;

/**
 * @OA\Tag(
 *     name="deposition",
 *     description="Depoimentos"
 * )
 */
class DepositionController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"deposition"},
     *     summary="Lista todos os depoimentos",
     *     description="Lista todos os depoimentos",
     *     path="/api/deposition",
     *     @OA\Response(response="200", description="Lista todos os depoimentos cadastrados"),
     * ),
     *
     */
    public function index()
    {
        return Deposition::orderBy('created_at', 'DESC')
            ->paginate(10);
    }

    /**
     * @OA\Post(
     *   tags={"deposition"},
     *   path="/api/deposition",
     *   summary="Cadastra um novo depoimento",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="author",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="description",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="role",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="avatar",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(DepositionRequest $request)
    {
        $request->validated();

        $deposition = Deposition::create($request->only([
            'author',
            'description',
            'role'
        ]));

        if (!empty($request->image)) {
            $imageName = $this->uploadFile($request->image);
            $deposition->update(['avatar' => $imageName]);
        }

        return response()->json([
            'error' => !$deposition,
            'data' => $deposition ? $deposition : [],
            'message' => $deposition ? "Cadastrado" : "Erro ao cadastrar"
        ], $deposition ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *   tags={"deposition"},
     *   path="/api/deposition/{id}",
     *   summary="Exibe um depoimento",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function show($id)
    {
        $deposition = Deposition::find($id);

        if (!$deposition) {
            return $this->returnIfNotExist();
        }

        return new DepositionResource($deposition);
    }

    /**
     * @OA\Post(
     *   tags={"deposition"},
     *   path="/api/deposition/{id}",
     *   summary="Edita um depoimento",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="author",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="description",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="role",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="avatar",
     *            type="string",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(DepositionRequest $request, $id)
    {
        $deposition = Deposition::find($id);

        if (!$deposition) {
            return $this->returnIfNotExist();
        }

        $oldFile = $deposition->getRawOriginal('avatar');
        $request->validated();

        $deposition = $deposition->update($request->only([
            'author',
            'description',
            'role'
        ]));

        if (!empty($request->image)) {
            $imageName = $this->uploadFile($request->image);
            $deposition = Deposition::find($id);
            $deposition->update(['avatar' => $imageName]);
            $this->deleteFile($oldFile);
        }

        return response()->json([
            'error'   => !$deposition,
            'message' => $deposition ? 'Atualizado' : 'Erro ao atualizar',
        ], $deposition ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    /**
     * @OA\Delete(
     *   tags={"deposition"},
     *   path="/api/deposition/{id}",
     *   summary="Remove um depoimento",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy($id)
    {
        $deposition = Deposition::find($id);

        if (!$deposition) {
            return $this->returnIfNotExist();
        }

        $deposition = $deposition->delete();

        return response()->json([
            'error'   => !$deposition,
            'message' => $deposition ? 'Removido' : 'Erro ao remover',
        ], $deposition ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    private function uploadFile($file)
    {
        $imageName = time() . "." . $file->extension();
        $file->storeAs('public/depositions', $imageName);

        return $imageName;
    }

    private function deleteFile($file)
    {
        try {
            $filePath = "app/public/depositions/" . $file;

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
            'Depoimento não encontrado'
        ], Response::HTTP_BAD_REQUEST);
    }
}
