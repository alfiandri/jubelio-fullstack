import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { db, withTx } from '../../db/pg';


export default async function importRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', fastify.authenticate);


    fastify.post('/import/dummyjson', async () => {
        const { data } = await axios.get('https://dummyjson.com/products?limit=1000');
        const products = data.products || [];

        await withTx(async (t) => {
            for (const p of products) {
                const exists = await t.oneOrNone('SELECT 1 FROM items WHERE item_code=$1', [String(p.id)]);
                if (!exists) {
                    await t.none(
                        `INSERT INTO items(item_code, item_name, price, description, image) VALUES($1,$2,$3,$4,$5)`,
                        [String(p.id), p.title, p.price, p.description, p.thumbnail]
                    );
                }
            }
        });


        return { imported: products.length };
    });
}