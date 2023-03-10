<?php

namespace App\Http\Controllers;

use App\Http\Requests\CouponStoreRequest;
use App\Http\Requests\CouponUpdateRequest;
use App\Http\Resources\CouponCollection;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use Illuminate\Http\{
    Request,
    Response
};
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="coupon",
 *     description="Cupons"
 * )
 */
class CouponController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"coupon"},
     *     summary="Lista todos os cupons",
     *     description="Lista todos os cupons",
     *     path="/api/coupon",
     *     @OA\Response(response="200", description="Lista todos os cupons cadastrados"),
     * ),
     *
    */
    public function index(Request $request, $onlyActive = false)
    {
        $coupons = Coupon::orderBy('id', 'DESC');

        if ($onlyActive) {
            $coupons = $coupons->active();
        }

        if (isset($request->per_page)) {
            $coupons = $coupons->paginate($request->per_page);
        } else {
            $coupons = $coupons->get();
        }

        return response()->json($coupons);
    }

    /**
     * @OA\Post(
     *   tags={"coupon"},
     *   path="/api/coupon",
     *   summary="Cadastra um novo cupom",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="value",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="discount_type",
     *            type="integer",
     *            description="1 - por porcentagem, 2 - por valor"
     *          ),
     *          @OA\Property(
     *            property="expire_at",
     *            type="date",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(CouponStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $coupon = Coupon::create($request->validated());

            DB::commit();

            return response()->json([
                'error'   => false,
                'data'    => $coupon,
                'message' => 'Cadastrado com sucesso'
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error'   => true,
                'data'    => [],
                'message' => 'Erro ao atualizar'
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @OA\Get(
     *   tags={"coupon"},
     *   path="/api/coupon/{id}",
     *   summary="Exibe um tipo de contrato",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show(Request $request, Coupon $coupon)
    {
        return new CouponResource($coupon);
    }

    /**
     * @OA\Put(
     *   tags={"coupon"},
     *   path="/api/coupon",
     *   summary="Editado um cupom",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="title",
     *            type="string",
     *          ),
     *          @OA\Property(
     *            property="value",
     *            type="number",
     *          ),
     *          @OA\Property(
     *            property="discount_type",
     *            type="integer",
     *            description="1 - por porcentagem, 2 - por valor"
     *          ),
     *          @OA\Property(
     *            property="expire_at",
     *            type="date",
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(CouponUpdateRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $coupon = Coupon::find($id);
            $coupon->fill($request->validated($request->all()))->save();

            DB::commit();

            return response()->json([
                'error'   => false,
                'data'    => $coupon,
                'message' => 'Atualizado com sucesso'
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error'   => true,
                'data'    => [],
                'message' => 'Erro ao atualizar'
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function validateCoupon($coupon)
    {
        $coupon = Coupon::where('title', $coupon)
            ->where('expire_at', '>=', date('Y-m-d'))
            ->first();

        return response()->json([
            'error'   => !$coupon,
            'message' => $coupon ? 'Cupom encontrado' : 'Cupom inexistente',
            'data'    => $coupon ? $coupon : []
        ], $coupon ? Response::HTTP_OK : Response::HTTP_OK);
    }

    public function calculateCouponDiscount($coupon, $value)
    {
        $coupon = Coupon::where('title', $coupon)->first();

        return $coupon->discount_type === Coupon::COUPON_TYPE['MOEDA']
            ? $this->discountByValue($coupon->value, $value)
            : $this->discountByPercentual($coupon->value, $value);
    }

    private function discountByPercentual($discount, $value)
    {
        $discount = $value * ($discount / 100);
        return $discount > 0 ? $discount : 0;
    }

    private function discountByValue($discount, $value)
    {
        $discount = $value - $discount;
        return $discount > 0 ? $discount : 0;
    }

    /**
     * @OA\Delete(
     *   tags={"coupon"},
     *   path="/api/coupon/{id}",
     *   summary="Remove um cupom",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Coupon $coupon)
    {
        if (!$coupon) {
            return response()->json([
                'error' => true,
                'message' => 'Erro ao remover'
            ], Response::HTTP_BAD_REQUEST);
        }

        $coupon->delete();
        return response()->json([
            'error' => false,
            'message' => 'Removido'
        ], Response::HTTP_CREATED);
    }
}
