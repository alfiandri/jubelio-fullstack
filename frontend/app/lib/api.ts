export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}


async function request(
    path: string,
    options: RequestInit = {}
) {
    const token = getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API ${res.status}: ${txt}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
}



export const api = {
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    getItems: () => request('/items'),
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
    getTransactions: () => request('/transactions'),
    getSummary: () => request('/summary/monthly'),
    importDummy: () => request('/import/dummyjson', { method: 'POST' }),
};