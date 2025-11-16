import { create } from "zustand";
import { API_URL } from "./api";
import { api } from "./api";
import { useAuth } from "./auth";

type HeadersObj = Record<string, string>;

interface StoreState {
    items: any[];
    transactions: any[];
    summary: any[];
    authHeaders: () => HeadersObj;
    loadItems: () => Promise<void>;
    loadTransactions: () => Promise<void>;
    loadSummary: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
    items: [],
    transactions: [],
    summary: [],

    authHeaders: () => {
        const state = (useAuth as any).getState() as { token?: string | null };
        const token = state?.token;
        if (!token) return {};
        return {
            Authorization: `Bearer ${token}`,
        };
    },

    loadItems: async () => {
        const res = await fetch(`${API_URL}/items`, {
            cache: "no-store",
            headers: {
                ...get().authHeaders(),
            },
        });
        set({ items: await res.json() });
    },

    createItem: async (data) => {
        await api.createItem(data);
        await get().loadItems();
    },

    updateItem: async (id, data) => {
        await api.updateItem(id, data);
        await get().loadItems();
    },

    deleteItem: async (id) => {
        if (!confirm("Delete this item?")) return;
        await api.deleteItem(id);
        await get().loadItems();
    },

    loadTransactions: async () => {
        const res = await fetch(`${API_URL}/transactions`, {
            cache: "no-store",
            headers: {
                ...get().authHeaders(),
            },
        });
        set({ transactions: await res.json() });
    },

    loadSummary: async () => {
        const res = await fetch(`${API_URL}/summary/monthly`, {
            cache: "no-store",
            headers: {
                ...get().authHeaders(),
            },
        });
        set({ summary: await res.json() });
    },
}));
