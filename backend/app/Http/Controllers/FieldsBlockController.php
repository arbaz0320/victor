<?php

namespace App\Http\Controllers;

use App\Http\Resources\FieldsBlockCollection;
use App\Http\Resources\FieldsBlockResource;
use App\Models\FieldsBlock;
use App\Models\FieldsOption;
use Illuminate\Http\{
    Request,
    Response
};
use Illuminate\Support\Facades\DB;

class FieldsBlockController extends Controller
{
    private $model;
    function __construct(FieldsBlock $model)
    {
        $this->model = $model;
    }
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\FieldsBlockCollection
     */
    public function index(Request $request)
    {
        $params = $request->all();
        $fieldsBlocks = $this->model->with(['options']);

        if (isset($params['termo'])) {
            $termo = $params['termo'];
            $fieldsBlocks->where('title', 'like', "%$termo%");
        }
        if (isset($params['limite'])) {
            $limite = $params['limite'];
            $fieldsBlocks->limit($limite);
        }

        $fieldsBlocks = $fieldsBlocks->get();
        return response()->json($fieldsBlocks);
        // return new FieldsBlockCollection($fieldsBlocks);
    }

    /**
     * @param \App\Http\Requests\FieldsBlockStoreRequest $request
     * @return \App\Http\Resources\FieldsBlockResource
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $params = $request->all();
            $fieldsBlock = FieldsBlock::create($params);
            $fieldsBlock->options()->createMany($params['options']);

            DB::commit();
            return response()->json(['error' => false, 'message' => "Campo cadastrado com sucesso", "data" => $fieldsBlock], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => true, 'message' => "Falha ao criar campo: {$e->getMessage()}"], 500);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\FieldsBlock $fieldsBlock
     * @return \App\Http\Resources\FieldsBlockResource
     */
    public function show(Request $request, $id)
    {
        $field = $this->model->with(['options'])->find($id);
        return response()->json($field);
    }

    /**
     * @param \App\Http\Requests\FieldsBlockUpdateRequest $request
     * @param \App\Models\FieldsBlock $fieldsBlock
     * @return \App\Http\Resources\FieldsBlockResource
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $params = $request->all();
            $field = $this->model->find($id);
            $field->fill($params)->save();

            foreach ($params['options'] as $option) {
                if (!isset($option['id'])) {
                    $option['field_id'] = $field->id;
                    FieldsOption::create($option);
                }
            }
            if (isset($params['optionsRemove'])) {
                foreach ($params['optionsRemove'] as $row) {
                    if (isset($row['id'])) {
                        $option = FieldsOption::find($row['id']);
                        if (!empty($option)) {
                            $option->delete();
                        }
                    }
                }
            }


            DB::commit();
            return response()->json([
                'error' => false,
                'message' => "Campo atualizado com sucesso",
                "data" => $field
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'error' => true,
                    'message' => "Falha ao atualizar campo: {$e->getMessage()}"
                ],
                500
            );
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\FieldsBlock $fieldsBlock
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $fieldsBlock = $this->model->find($id);
        $fieldsBlock->delete();

        return response()->json([
            'error'   => $fieldsBlock ? false : true,
            'message' => $fieldsBlock ? 'Campo removido com sucesso.' : 'Erro ao remover campo'
        ], $fieldsBlock ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST);
    }
}
