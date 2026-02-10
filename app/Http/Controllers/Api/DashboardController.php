<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard summary (HO only).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function summary()
    {
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', '!=', Order::STATUS_PENDING)->sum('total_price');

        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return response()->json([
            'message' => 'Dashboard summary berhasil diambil',
            'data' => [
                'total_products' => $totalProducts,
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'orders_by_status' => [
                    'pending' => $ordersByStatus['pending'] ?? 0,
                    'paid' => $ordersByStatus['paid'] ?? 0,
                    'shipped' => $ordersByStatus['shipped'] ?? 0,
                ],
            ],
        ], 200);
    }
}
