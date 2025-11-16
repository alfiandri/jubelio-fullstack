import { buildApp } from './index';

async function start() {
    const app = buildApp();

    const port = Number(process.env.PORT || 3001);
    const host = process.env.HOST || '0.0.0.0';

    try {
        await app.listen({ port, host });
        console.log(`Backend running at http://${host}:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();
