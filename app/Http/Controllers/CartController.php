<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cart = $user->cart;
        $items = $cart ? $cart->items()->with('product')->get() : [];

        return Inertia::render('Cart/Index', [
            'cartItems' => $items
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $cart = $user->cart ?? $user->cart()->create();

        $product = Product::find($request->product_id);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();
        $currentQty = $cartItem ? $cartItem->quantity : 0;
        $newQty = $currentQty + $request->quantity;

        if ($product->stock_quantity < $newQty) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        if ($cartItem) {
            $cartItem->quantity = $newQty;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->route('cart.index');
    }

    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $user = $request->user();
        $cart = $user->cart;

        if (!$cart) {
            return back()->withErrors(['error' => 'Cart not found']);
        }

        $cartItem = $cart->items()->where('id', $id)->firstOrFail();

        $product = $cartItem->product;
        if ($product->stock_quantity < $request->quantity) {
            return back()->withErrors(['quantity' => 'Not enough stock.']);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back();
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($user->cart) {
            $user->cart->items()->where('id', $id)->delete();
        }
        return back();
    }
}
