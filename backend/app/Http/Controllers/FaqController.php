<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\{
    Request,
    Response
};
use App\Http\Requests\FaqRequest;
use Illuminate\Support\Facades\DB;

class FaqController extends Controller
{
    public function __construct(Faq $model)
    {
        $this->model = $model;
    }

    public function index(Request $request)
    {
        $faqs = Faq::orderBy('id', 'DESC');

        if (isset($request->per_page)) {
            $faqs = $faqs->simplePaginate($request->per_page);

            return response()->json($faqs, Response::HTTP_OK);
        } else {
            $faqs = $faqs->get();
            return response()->json(['data' => $faqs], Response::HTTP_OK);
        }
    }

    public function store(FaqRequest $request)
    {
        DB::beginTransaction();
        try {
            $params = $request->all();
            $faq = $this->model->create($request->validated($params));

            DB::commit();
            return response()->json(['message' => "FAQ cadastrada com sucesso", "result" => $faq], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao criar FAQ: {$e->getMessage()}"], Response::HTTP_BAD_REQUEST);
        }
    }

    public function show($id)
    {
        $faq = Faq::find($id);

        if (!$faq) {
            return response()->json(['error' => true, 'message' => 'FAQ não encontrado'], Response::HTTP_BAD_REQUEST);
        }

        return response()->json(['error' => false, 'data' => $faq], Response::HTTP_OK);
    }

    public function update(FaqRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $params = $request->all();
            $faq = $this->model->find($id);

            $faq->fill($request->validated($params))->save();

            DB::commit();
            return response()->json(['message' => "FAQ atualizado com sucesso", "result" => $faq], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao atualizar FAQ: {$e->getMessage()}"], Response::HTTP_BAD_REQUEST);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $faq = $this->model->find($id);
            $faq->delete();

            DB::commit();
            return response()->json(['message' => "FAQ excluído com sucesso", "result" => $faq], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao excluir FAQ: {$e->getMessage()}"], Response::HTTP_BAD_REQUEST);
        }
    }
}
