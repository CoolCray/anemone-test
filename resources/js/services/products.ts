import { API_BASE_URL, getHeaders, handleResponse } from './http';
import { Product, ApiResponse } from '../types/models';

/**
 * Get all products
 */
export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse<ApiResponse<Product[]>>(response);
};

/**
 * Create new product (HO only)
 */
export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData),
    });

    return handleResponse<ApiResponse<Product>>(response);
};

/**
 * Update product (HO only)
 */
export const updateProduct = async (productId: number, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(productData),
    });

    return handleResponse<ApiResponse<Product>>(response);
};

/**
 * Delete product (HO only)
 */
export const deleteProduct = async (productId: number): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    return handleResponse<ApiResponse<null>>(response);
};
