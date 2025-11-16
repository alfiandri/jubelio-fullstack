import { FastifyInstance } from 'fastify';
import authRoutes from './auth/auth.route';
import transactionsRoutes from './transactions/transactions.route';
import importRoutes from './imports/import.route';
import itemsRoutes from './items/items.route';

export default function registerRoutes(app: FastifyInstance) {
    app.register(authRoutes);
    app.register(transactionsRoutes);
    app.register(importRoutes);
    app.register(itemsRoutes);

    app.get("/", async () => {
        return { status: "Backend OK", version: "1.0.0" };
    });
    app.get("/health", async () => {
        return 200;
    });
}
