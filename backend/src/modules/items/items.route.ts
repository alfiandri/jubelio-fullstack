import { FastifyInstance } from 'fastify';
import { db } from '../../db/pg';
import { SQL } from './items.sql';


export default async function itemsRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', fastify.authenticate);


    fastify.get('/items', async (req) => {
        const { limit = 50, offset = 0 } = (req.query as any) || {};
        return db.any(SQL.list, [limit, offset]);
    });


    fastify.get('/items/:id', async (req, reply) => {
        const { id } = req.params as any;
        const row = await db.oneOrNone(SQL.get, [id]);
        if (!row) return reply.code(404).send({ message: 'Not found' });
        return row;
    });
    
    fastify.get('/items/count', async (req, reply) => {
        return db.one(SQL.countAll).then(row => ({ count: Number(row.count) }));
    });

    fastify.post('/items', async (req, reply) => {
        const b = req.body as any;
        const exists = await db.oneOrNone(SQL.findByCode, [b.item_code]);
        if (exists) return reply.code(409).send({ message: 'Duplicate item_code' });
        const row = await db.one(SQL.create, [b.item_code, b.item_name, b.price, b.description, b.image]);
        return row;
    });


    fastify.put('/items/:id', async (req, reply) => {
        const { id } = req.params as any;
        const b = req.body as any;
        const row = await db.oneOrNone(SQL.update, [b.item_code, b.item_name, b.price, b.description, b.image, id]);
        if (!row) return reply.code(404).send({ message: 'Not found' });
        return row;
    });


    fastify.delete('/items/:id', async (req) => {
        const { id } = req.params as any;
        await db.none(SQL.delete, [id]);
        return { ok: true };
    });
}