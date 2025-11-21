import Fastify from "fastify";
import itemsRoutes from "../../modules/items/items.route";

export async function buildTestApp() {
    const app = Fastify();

    // Fake authentication hook
    app.decorate("authenticate", async () => { });

    await app.register(itemsRoutes);

    await app.ready();
    return app;
}
