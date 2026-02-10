import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken, getUser } from '../services/http';
import { User } from '../types/models';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
    const token = getAuthToken();
    const user = getUser() as User | null;

    // Jika tidak ada token, redirect ke login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Jika ada role yang diizinkan, cek apakah user memiliki role tersebut
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect ke halaman yang sesuai dengan role
        if (user.role === 'ho') {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/catalog" replace />;
        }
    }

    return <>{children}</>;
}
