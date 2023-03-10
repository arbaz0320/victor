<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContractCouponStoreRequest;
use App\Http\Requests\ContractCouponUpdateRequest;
use App\Http\Resources\ContractCouponCollection;
use App\Http\Resources\ContractCouponResource;
use App\Models\ContractCoupon;
use Illuminate\Http\Request;

class ContractCouponController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ContractCouponCollection
     */
    public function index(Request $request)
    {
        $contractCoupons = ContractCoupon::all();

        return new ContractCouponCollection($contractCoupons);
    }

    /**
     * @param \App\Http\Requests\ContractCouponStoreRequest $request
     * @return \App\Http\Resources\ContractCouponResource
     */
    public function store(ContractCouponStoreRequest $request)
    {
        $contractCoupon = ContractCoupon::create($request->validated());

        return new ContractCouponResource($contractCoupon);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ContractCoupon $contractCoupon
     * @return \App\Http\Resources\ContractCouponResource
     */
    public function show(Request $request, ContractCoupon $contractCoupon)
    {
        return new ContractCouponResource($contractCoupon);
    }

    /**
     * @param \App\Http\Requests\ContractCouponUpdateRequest $request
     * @param \App\Models\ContractCoupon $contractCoupon
     * @return \App\Http\Resources\ContractCouponResource
     */
    public function update(ContractCouponUpdateRequest $request, ContractCoupon $contractCoupon)
    {
        $contractCoupon->update($request->validated());

        return new ContractCouponResource($contractCoupon);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ContractCoupon $contractCoupon
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ContractCoupon $contractCoupon)
    {
        $contractCoupon->delete();

        return response()->noContent();
    }
}
