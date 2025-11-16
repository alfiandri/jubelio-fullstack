import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { registerAuth } from './middlewares/auth';
import registerRoutes from './modules';

export const buildApp = () => {
    const app = Fastify({
        logger: true,
    });

    app.register(fastifyCors, {
        origin: '*',
    });

    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'supersecret',
    });

    registerAuth(app);

    registerRoutes(app);

    return app;
};
