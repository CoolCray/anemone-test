import { API_BASE_URL, getHeaders, handleResponse } from './http';
import { ApiResponse } from '../types/models';

export interface DashboardData {
    total_products: number;
    total_orders: number;
    total_revenue: number;
    orders_by_status: {
        pending: number;
        paid: number;
        shipped: number;
        completed: number;
        cancelled: number;
    };
}

/**
 * Get dashboard summary (HO only)
 */
export const getDashboardSummary = async (): Promise<ApiResponse<DashboardData>> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse<ApiResponse<DashboardData>>(response);
};
