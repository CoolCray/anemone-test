import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/products';
import { createOrder } from '../services/orders';
import Layout from '../components/Layout';
import { Product } from '../types/models';

interface CartItem {
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
}

/**
 * ProductCatalog - Halaman daftar produk dengan cart & checkout
 */
export default function ProductCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCart, setShowCart] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getProducts();
            setProducts(response.data);
        } catch (err: any) {
            setError(err.message || 'Gagal mengambil data produk');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Cart Functions
    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product_id === product.id);
        
        if (existingItem) {
            // Update quantity
            setCart(cart.map(item =>
                item.product_id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // Add new item
            setCart([...cart, {
                product_id: product.id,
                product: product,
                quantity: 1,
                price: product.price
            }]);
        }
        setShowCart(true);
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toString().includes(searchQuery)
    );

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Keranjang kosong!');
            return;
        }

        try {
            setCheckoutLoading(true);
            
            // Format items untuk API
            const items = cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

            await createOrder({ items });
            
            // Reset cart
            setCart([]);
            setShowCart(false);
            
            alert('Order berhasil dibuat! Silakan cek di halaman "Order Saya"');
            
            // Refresh products untuk update stok
            fetchProducts();
        } catch (err: any) {
            alert(err.message || 'Gagal membuat order');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="p-4 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Katalog Produk</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="p-4 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Katalog Produk</h1>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-red-800 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button onClick={fetchProducts} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (products.length === 0) {
        return (
            <Layout>
                <div className="p-4 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Katalog Produk</h1>
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Produk</h3>
                        <p className="text-gray-600">Produk akan ditampilkan di sini setelah ditambahkan.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
                    <div className="flex gap-3">
                        <button onClick={fetchProducts} className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                        <button onClick={() => setShowCart(true)} className="relative bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Keranjang
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Hasil</h3>
                        <p className="text-gray-600">Tidak ditemukan produk yang sesuai dengan pencarian Anda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                                    <p className="text-2xl font-bold text-blue-600 mb-3">{formatPrice(product.price)}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Stok: <span className="font-semibold">{product.stock}</span>
                                        </span>
                                        {product.stock > 0 ? (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Tersedia
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                Habis
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className={`w-full py-3 font-medium transition-colors ${
                                        product.stock > 0
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowCart(false)} />
                    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
                        {/* Cart Header */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Keranjang</h2>
                            <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-gray-600">Keranjang kosong</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.product_id)} className="text-red-500 hover:text-red-700">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="bg-white border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100">
                                                        -
                                                    </button>
                                                    <span className="font-semibold">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="bg-white border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100">
                                                        +
                                                    </button>
                                                </div>
                                                <p className="font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cart.length > 0 && (
                            <div className="border-t border-gray-200 p-6 space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {checkoutLoading ? 'Memproses...' : 'Checkout'}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
}
