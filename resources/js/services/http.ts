import { User } from '../types/models';

export const API_BASE_URL = 'http://localhost:8000/api';

// Helper function untuk mendapatkan auth token dari localStorage
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// Helper function untuk menyimpan auth token
export const setAuthToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

// Helper function untuk menghapus auth token
export const removeAuthToken = (): void => {
    localStorage.removeItem('auth_token');
};

// Helper function untuk mendapatkan user data
export const getUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Helper function untuk menyimpan user data
export const setUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Helper function untuk menghapus user data
export const removeUser = (): void => {
    localStorage.removeItem('user');
};

// Helper function untuk membuat headers dengan auth token
export const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Helper function untuk handle response
export const handleResponse = async <T>(response: Response): Promise<T> => {
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

    return data as T;
};
