import '@fastify/jwt';
import { FastifyRequest } from 'fastify';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: string; email: string };
        user: { id: string; email: string };
    }
}

declare module 'fastify' {
    interface FastifyRequest {
        jwtVerify: () => Promise<any>;
    }

    interface FastifyInstance {
        jwt: {
            sign(payload: any): string;
            verify(token: string): any;
        };

        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
