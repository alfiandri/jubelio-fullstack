export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}


async function request(path: string, options: RequestInit = {}) {
    const token = getToken();

    const headers: HeadersInit = {
        ...(options.headers || {})
    };

    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
        throw new Error(`API ${res.status}: ${text}`);
    }

    return text ? JSON.parse(text) : null;
}

export const api = {
    login: (email, password) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    getItems: (limit = 20, offset = 0) =>
        request(`/items?limit=${limit}&offset=${offset}`),

    createItem: (data) =>
        request("/items", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateItem: (id, data) =>
        request(`/items/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    deleteItem: (id) =>
        request(`/items/${id}`, {
            method: "DELETE",
        }),

    createTransaction: (data) =>
        request("/transactions", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateTransaction: (id, data) =>
        request(`/transactions/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    deleteTransaction: (id) =>
        request(`/transactions/${id}`, {
            method: "DELETE",
        }),

    getTransactions: (limit = 20, offset = 0) =>
        request(`/transactions?limit=${limit}&offset=${offset}`),
    getSummary: () => request('/summary/monthly'),
    importDummy: () => request('/import/dummyjson', { method: 'POST' }),
};
