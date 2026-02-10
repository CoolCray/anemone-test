import { API_BASE_URL, getHeaders, handleResponse, setAuthToken, setUser, removeAuthToken, removeUser } from './http';
import { User, ApiResponse } from '../types/models';

interface LoginResponse {
    message: string;
    user: User;
    token: string;
}

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse<LoginResponse>(response);

    // Simpan token dan user data
    setAuthToken(data.token);
    setUser(data.user);

    return data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getHeaders(),
    });

    const data = await handleResponse<ApiResponse<null>>(response);

    // Hapus token dan user data
    removeAuthToken();
    removeUser();

    return data;
};
