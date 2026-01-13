import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, cartItems, errors }) {
    const { post, processing } = useForm();

    const handleCheckout = () => {
        if (confirm('Are you sure you want to place this order?')) {
            post(route('checkout.store'));
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Shopping Cart</h2>}
        >
            <Head title="Cart" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        {errors && errors.error && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded transition-all">
                                {errors.error}
                            </div>
                        )}
                        {cartItems.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                Your cart is empty. <br />
                                <a href={route('products.index')} className="text-indigo-600 hover:text-indigo-800 underline mt-2 inline-block">Go Shopping</a>
                            </div>
                        ) : (
                            <>
                                <div className="hidden sm:block">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {cartItems.map(item => (
                                                <CartItemRow key={item.id} item={item} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile View (simple cards) could be implemented here */}

                                <div className="mt-8 flex justify-end items-center border-t pt-6">
                                    <div className="text-right">
                                        <p className="text-lg text-gray-600">Subtotal</p>
                                        <p className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={processing}
                                            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            {processing ? 'Processing...' : 'Checkout'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function CartItemRow({ item }) {
    const { data, setData, patch, processing, delete: destroy } = useForm({
        quantity: item.quantity
    });

    // Auto-update on blur or change? Better explicit for UX, but prompt wants "Update quantities".
    // I'll add an update handler that triggers on blur or explicit button?
    // Let's do onChange + blur/enter.

    const updateQuantity = (newQty) => {
        if (newQty < 1) return;
        router.patch(route('cart.update', item.id), { quantity: newQty }, {
            preserveScroll: true
        });
    };

    const removeItem = () => {
        router.delete(route('cart.destroy', item.id), {
            preserveScroll: true
        });
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">${item.product.price}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="number"
                    min="1"
                    className="w-20 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    defaultValue={item.quantity}
                    onChange={(e) => updateQuantity(e.target.value)}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">${(item.quantity * item.product.price).toFixed(2)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={removeItem} className="text-red-600 hover:text-red-900">Remove</button>
            </td>
        </tr>
    );
}
