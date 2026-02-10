import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orders';
import Layout from '../components/Layout';
import { Order } from '../types/models';

export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOrders();
            setOrders(response.data);
        } catch (err: any) {
            setError(err.message || 'Gagal mengambil data order');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            paid: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dibayar' },
            shipped: { bg: 'bg-green-100', text: 'text-green-800', label: 'Dikirim' },
        };
        return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' || 
            order.id.toString().includes(searchQuery);
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <Layout>
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Saya</h1>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
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
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Saya</h1>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800 mb-4">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (orders.length === 0) {
        return (
            <Layout>
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Saya</h1>
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Order</h3>
                        <p className="text-gray-600 mb-4">Anda belum membuat order apapun.</p>
                        <a
                            href="/catalog"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                        >
                            Lihat Katalog Produk
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Saya</h1>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full sm:w-auto justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Cari Order
                            </label>
                            <div className="relative">
                                <input
                                    id="search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari berdasarkan ID order..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="w-full md:w-48">
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                Filter Status
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Dibayar</option>
                                <option value="shipped">Dikirim</option>
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-3 text-sm text-gray-600">
                        Menampilkan {filteredOrders.length} dari {orders.length} order
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Hasil</h3>
                        <p className="text-gray-600">Tidak ditemukan order yang sesuai dengan pencarian Anda.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                        const statusInfo = getStatusBadge(order.status);
                        return (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-auto">
                                        <p className="text-xl md:text-2xl font-bold text-blue-600">{formatCurrency(order.total_price)}</p>
                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Detail Order:</h4>
                                    <div className="space-y-2">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatCurrency(item.price)} x {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
