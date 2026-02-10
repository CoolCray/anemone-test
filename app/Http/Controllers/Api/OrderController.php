<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     * HO sees all orders, Outlet sees only their own.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'ho') {
            // HO can see all orders
            $orders = Order::with(['outlet', 'items.product'])->get();
        } else {
            // Outlet can only see their own orders
            $orders = Order::with(['items.product'])
                ->where('outlet_id', $user->id)
                ->get();
        }

        return response()->json([
            'message' => 'Daftar order berhasil diambil',
            'data' => $orders,
        ], 200);
    }

    /**
     * Store a newly created order (Outlet only).
     * Uses database transaction and validates stock.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $totalPrice = 0;
            $orderItemsData = [];

            // Validate stock and calculate total price
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["Stok produk '{$product->name}' tidak mencukupi. Stok tersedia: {$product->stock}"],
                    ]);
                }

                // Decrease stock
                $product->stock -= $item['quantity'];
                $product->save();

                $itemPrice = $product->price * $item['quantity'];
                $totalPrice += $itemPrice;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];
            }

            // Create order
            $order = Order::create([
                'outlet_id' => $request->user()->id,
                'total_price' => $totalPrice,
                'status' => Order::STATUS_PENDING,
            ]);

            // Create order items
            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            DB::commit();

            // Load relationships for response
            $order->load(['items.product']);

            return response()->json([
                'message' => 'Order berhasil dibuat',
                'data' => $order,
            ], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Terjadi kesalahan saat membuat order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update order status (HO only).
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,shipped',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $validated['status'];
        $order->save();

        return response()->json([
            'message' => 'Status order berhasil diupdate',
            'data' => $order,
        ], 200);
    }
}
