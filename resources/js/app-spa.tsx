import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

// Pages
import Login from './pages/Login';
import DashboardHO from './pages/DashboardHO';
import AllOrders from './pages/AllOrders';
import ProductManagement from './pages/ProductManagement';
import ProductCatalog from './pages/ProductCatalog';
import MyOrders from './pages/MyOrders';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { getAuthToken, getUser } from './services/api';

function App() {
    const token = getAuthToken();
    const user = getUser();

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route 
                    path="/login" 
                    element={token ? <Navigate to={user?.role === 'ho' ? '/dashboard' : '/catalog'} replace /> : <Login />} 
                />

                {/* HO Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['ho']}>
                            <DashboardHO />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute allowedRoles={['ho']}>
                            <AllOrders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute allowedRoles={['ho']}>
                            <ProductManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Outlet Routes */}
                <Route
                    path="/catalog"
                    element={
                        <ProtectedRoute allowedRoles={['outlet']}>
                            <ProductCatalog />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-orders"
                    element={
                        <ProtectedRoute allowedRoles={['outlet']}>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        token ? (
                            <Navigate to={user?.role === 'ho' ? '/dashboard' : '/catalog'} replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

// Mount the app
const el = document.getElementById('app');
if (el) {
    const root = createRoot(el);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
