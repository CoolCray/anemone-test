import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../services/orders';
import Layout from '../components/Layout';
import { Order } from '../types/models';

export default function AllOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
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

    const handleStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
        try {
            setUpdatingOrderId(orderId);
            await updateOrderStatus(orderId, newStatus);
            // Update local state
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err: any) {
            alert(err.message || 'Gagal update status order');
        } finally {
            setUpdatingOrderId(null);
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
        const badges: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-blue-100 text-blue-800',
            shipped: 'bg-green-100 text-green-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' || 
            order.id.toString().includes(searchQuery) ||
            order.outlet?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <Layout>
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Semua Order</h1>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Semua Order</h1>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Semua Order</h1>
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Order</h3>
                        <p className="text-gray-600">Order akan ditampilkan di sini setelah outlet membuat order.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Semua Order</h1>
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
                                    placeholder="Cari berdasarkan ID atau nama outlet..."
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
                                <option value="paid">Paid</option>
                                <option value="shipped">Shipped</option>
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
                        {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-600">Outlet: {order.outlet?.name}</p>
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
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                                <div className="space-y-2">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.product?.name} x {item.quantity}
                                            </span>
                                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status:</label>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                                    disabled={updatingOrderId === order.id}
                                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="shipped">Shipped</option>
                                </select>
                                {updatingOrderId === order.id && (
                                    <span className="ml-2 text-sm text-gray-600">Updating...</span>
                                )}
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
