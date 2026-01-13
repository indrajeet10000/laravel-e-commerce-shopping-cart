<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Jobs\LowStockNotificationJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart;

        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors(['error' => 'Cart is empty']);
        }

        try {
            DB::transaction(function () use ($user, $cart) {
                $total = 0;
                // Calculate total first or during loop?
                // We need to lock rows? Or just optimistic? 
                // For simple app, optimistic is fine.

                $items = $cart->items()->with('product')->get();
                $orderItemsData = [];

                foreach ($items as $item) {
                    $product = $item->product;

                    if ($product->stock_quantity < $item->quantity) {
                        throw new \Exception("Product {$product->name} does not have enough stock.");
                    }

                    $price = $product->price;
                    $total += $price * $item->quantity;

                    // Decrement stock
                    $product->decrement('stock_quantity', $item->quantity);

                    // Check low stock
                    if ($product->stock_quantity < 5) { // Threshold 5
                        LowStockNotificationJob::dispatch($product);
                    }

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item->quantity,
                        'price' => $price,
                    ];
                }

                $order = Order::create([
                    'user_id' => $user->id,
                    'total_price' => $total,
                ]);

                foreach ($orderItemsData as $data) {
                    $order->items()->create($data);
                }

                $cart->items()->delete();
            });

            return redirect()->route('products.index')->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
