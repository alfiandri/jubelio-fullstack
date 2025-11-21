import { create } from "zustand";
import { API_URL } from "./api";
import { api } from "./api";
import { useAuth } from "./auth";

type HeadersObj = Record<string, string>;

interface StoreState {
    items: any[];
    transactions: any[];
    summary: any[];

    totalItems?: number;
    monthlyRevenue?: number;
    recentTransactions?: any[];

    authHeaders: () => HeadersObj;

    loadItems: (page?: number, limit?: number) => Promise<void>;
    createItem: (data: any) => Promise<void>;
    updateItem: (id: number, data: any) => Promise<void>;
    deleteItem: (id: number) => Promise<void>;

    // Transaction actions
    createTransaction: (data: any) => Promise<void>;
    updateTransaction: (id: number, data: any) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;

    loadTransactions: (page?: number, limit?: number) => Promise<void>;
    loadSummary: () => Promise<void>;
    loadDashboard: () => Promise<void>;
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

    loadItems: async (page = 1, limit = 20) => {
        const offset = (page - 1) * limit;
        const res = await api.getItems(limit, offset);
        set({ items: res });
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

    createTransaction: async (data) => {
        await api.createTransaction(data);
        await get().loadTransactions();
    },

    updateTransaction: async (id, data) => {
        await api.updateTransaction(id, data);
        await get().loadTransactions();
    },

    deleteTransaction: async (id) => {
        if (!confirm("Delete this transaction?")) return;
        await api.deleteTransaction(id);
        await get().loadTransactions();
    },

    loadTransactions: async (page = 1, limit = 20) => {
        const offset = (page - 1) * limit;
        const res = await api.getTransactions(limit, offset);
        set({ transactions: res });
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

    loadDashboard: async () => {
        const headers = get().authHeaders();

        const [itemsRes, revenueRes, trxRes] = await Promise.all([
            fetch(`${API_URL}/items/count`, { headers }),
            fetch(`${API_URL}/transactions/monthly`, { headers }),
            fetch(`${API_URL}/transactions?limit=5`, { headers }),
        ]);

        const totalItems = await itemsRes.json();
        const monthlyRevenue = await revenueRes.json();
        const recentTransactions = await trxRes.json();

        set({
            totalItems: totalItems.count,
            monthlyRevenue: monthlyRevenue.total,
            recentTransactions,
        });
    },

}));
