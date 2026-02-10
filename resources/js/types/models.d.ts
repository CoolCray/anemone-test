export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'outlet' | 'ho';
    outlet_name?: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at: string;
    updated_at: string;
    product?: Product;
}

export interface Order {
    id: number;
    user_id: number;
    total_price: number;
    status: 'pending' | 'paid' | 'shipped';
    created_at: string;
    updated_at: string;
    user?: User;
    outlet?: { // Check if backend returns 'outlet' or nested in user or something else. AllOrders.tsx uses order.outlet.name
        id: number;
        name: string;
    }; 
    items?: OrderItem[];
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}
