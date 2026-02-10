import { API_BASE_URL, getHeaders, handleResponse } from './http';
import { Order, ApiResponse } from '../types/models';

/**
 * Get orders (filtered by role)
 */
export const getOrders = async (): Promise<ApiResponse<Order[]>> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse<ApiResponse<Order[]>>(response);
};

interface CreateOrderData {
    items: {
        product_id: number;
        quantity: number;
    }[];
}

/**
 * Create new order (Outlet only)
 */
export const createOrder = async (orderData: CreateOrderData): Promise<ApiResponse<Order>> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
    });

    return handleResponse<ApiResponse<Order>>(response);
};

/**
 * Update order status (HO only)
 */
export const updateOrderStatus = async (orderId: number, status: Order['status']): Promise<ApiResponse<Order>> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    });

    return handleResponse<ApiResponse<Order>>(response);
};
