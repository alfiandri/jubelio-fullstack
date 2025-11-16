import { FastifyInstance } from 'fastify';
import { env } from "../../config/env";


export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/login', async (req, reply) => {
        const body = (req.body as any) || {};
        if (body.email === env.BASIC_USER && body.password === env.BASIC_PASS) {
            const token = fastify.jwt.sign({
                id: body.email,
                email: body.email
            });

            return { token };
        }
        reply.code(401).send({ message: 'Invalid credentials' });
    });
}