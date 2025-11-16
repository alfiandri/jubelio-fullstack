import { create } from 'zustand';
import { API_URL } from './api';

export const useAuth = create((set) => ({
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    loading: false,
    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error('Invalid credentials');
            const { token } = await res.json();
            localStorage.setItem('token', token);
            set({ token, loading: false });
            return token;
        } catch (e) {
            set({ loading: false });
            throw e;
        }
    },
    logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        set({ token: null });
    }
}));