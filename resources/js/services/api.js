// API Service untuk Fetch API
// Base URL untuk API
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function untuk mendapatkan auth token dari localStorage
export const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

// Helper function untuk menyimpan auth token
export const setAuthToken = (token) => {
    localStorage.setItem('auth_token', token);
};

// Helper function untuk menghapus auth token
export const removeAuthToken = () => {
    localStorage.removeItem('auth_token');
};

// Helper function untuk mendapatkan user data
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Helper function untuk menyimpan user data
export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Helper function untuk menghapus user data
export const removeUser = () => {
    localStorage.removeItem('user');
};

// Helper function untuk membuat headers dengan auth token
const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Helper function untuk handle response
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        // Jika unauthorized, hapus token dan redirect ke login
        if (response.status === 401) {
            removeAuthToken();
            removeUser();
            window.location.href = '/login';
        }

        throw new Error(data.message || 'Terjadi kesalahan');
    }

    return data;
};

// ==================== AUTH API ====================

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{message: string, user: object, token: string}>}
 */
export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Simpan token dan user data
    setAuthToken(data.token);
    setUser(data.user);

    return data;
};

/**
 * Logout user
 * @returns {Promise<{message: string}>}
 */
export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getHeaders(),
    });

    const data = await handleResponse(response);

    // Hapus token dan user data
    removeAuthToken();
    removeUser();

    return data;
};

// ==================== PRODUCT API ====================

/**
 * Get all products
 * @returns {Promise<{message: string, data: array}>}
 */
export const getProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
};

/**
 * Create new product (HO only)
 * @param {object} productData - {name, price, stock}
 * @returns {Promise<{message: string, data: object}>}
 */
export const createProduct = async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData),
    });

    return handleResponse(response);
};

/**
 * Update product (HO only)
 * @param {number} productId - Product ID
 * @param {object} productData - {name, price, stock}
 * @returns {Promise<{message: string, data: object}>}
 */
export const updateProduct = async (productId, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(productData),
    });

    return handleResponse(response);
};

/**
 * Delete product (HO only)
 * @param {number} productId - Product ID
 * @returns {Promise<{message: string}>}
 */
export const deleteProduct = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    return handleResponse(response);
};

// ==================== ORDER API ====================

/**
 * Get orders (filtered by role)
 * @returns {Promise<{message: string, data: array}>}
 */
export const getOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
};

/**
 * Create new order (Outlet only)
 * @param {object} orderData - {items: [{product_id, quantity}]}
 * @returns {Promise<{message: string, data: object}>}
 */
export const createOrder = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
    });

    return handleResponse(response);
};

/**
 * Update order status (HO only)
 * @param {number} orderId
 * @param {string} status - 'pending' | 'paid' | 'shipped'
 * @returns {Promise<{message: string, data: object}>}
 */
export const updateOrderStatus = async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    });

    return handleResponse(response);
};

// ==================== DASHBOARD API ====================

/**
 * Get dashboard summary (HO only)
 * @returns {Promise<{message: string, data: object}>}
 */
export const getDashboardSummary = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
};
