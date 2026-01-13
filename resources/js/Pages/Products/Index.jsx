import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, products }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">No products available.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ProductCard({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        quantity: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('cart.store'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                        ${product.price}
                    </span>
                </div>

                <div className="mt-4">
                    <p className={`text-sm font-medium ${product.stock_quantity < 5 ? 'text-red-500' : 'text-gray-500'}`}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                    </p>
                </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
                <form onSubmit={submit} className="flex gap-2">
                    <input
                        type="number"
                        min="1"
                        max={product.stock_quantity}
                        value={data.quantity}
                        onChange={e => setData('quantity', e.target.value)}
                        className="w-20 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        disabled={product.stock_quantity < 1}
                    />
                    <button
                        type="submit"
                        disabled={processing || product.stock_quantity < 1}
                        className={`flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-md font-semibold text-sm ${processing || product.stock_quantity < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Add
                    </button>
                </form>
                {errors.quantity && <div className="text-red-500 text-xs mt-2">{errors.quantity}</div>}
            </div>
        </div>
    );
}
