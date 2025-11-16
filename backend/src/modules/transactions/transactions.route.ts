import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { db, withTx } from "../../db/pg";
import { SQL } from "./transactions.sql";

/**
 * Transaction module
 * - create hypertable-safe transactions
 * - compute amount = item.price * qty
 * - prevent race conditions with SERIALIZABLE lock
 * - refresh materialized view after commit
 */
export default async function transactionsRoutes(fastify: FastifyInstance) {
    fastify.addHook("onRequest", fastify.authenticate);

    fastify.get("/transactions", async (req: FastifyRequest, reply: FastifyReply) => {
        const { limit = 50, offset = 0 } = (req.query as any) || {};
        const rows = await db.any(SQL.list, [limit, offset]);
        return reply.send(rows);
    });

    fastify.get("/transactions/:id", async (req: FastifyRequest, reply: FastifyReply) => {
        const { id } = req.params as any;
        const row = await db.oneOrNone(SQL.get, [id]);
        if (!row) return reply.code(404).send({ message: "Transaction not found" });
        return reply.send(row);
    });

    fastify.post("/transactions", async (req: FastifyRequest, reply: FastifyReply) => {
        const body = req.body as any;
        if (!body.item_id || !body.qty) {
            return reply.code(400).send({ message: "item_id and qty are required" });
        }

        return withTx(async (t) => {
            // lock ensures race-safety in parallel writes
            await t.none("LOCK TABLE transactions IN EXCLUSIVE MODE");

            const priceRow = await t.oneOrNone(SQL.priceByItem, [body.item_id]);
            if (!priceRow) throw new Error("Invalid item_id");

            const amount = Number(priceRow.price) * Number(body.qty);
            const trx = await t.one(SQL.insert, [body.item_id, body.qty, amount]);

            // refresh materialized view after insert
            await t.none("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_summary");

            return reply.code(201).send({
                message: "Transaction created",
                data: trx,
            });
        });
    });

    fastify.put("/transactions/:id", async (req: FastifyRequest, reply: FastifyReply) => {
        const { id } = req.params as any;
        const body = req.body as any;
        if (!body.item_id || !body.qty) {
            return reply.code(400).send({ message: "item_id and qty are required" });
        }

        const priceRow = await db.oneOrNone(SQL.priceByItem, [body.item_id]);
        if (!priceRow) return reply.code(400).send({ message: "Invalid item_id" });

        const amount = Number(priceRow.price) * Number(body.qty);
        const trx = await db.oneOrNone(SQL.update, [body.item_id, body.qty, amount, id]);
        if (!trx) return reply.code(404).send({ message: "Transaction not found" });

        await db.none("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_summary");

        return reply.send({ message: "Transaction updated", data: trx });
    });

    fastify.delete("/transactions/:id", async (req: FastifyRequest, reply: FastifyReply) => {
        const { id } = req.params as any;
        const found = await db.oneOrNone(SQL.get, [id]);
        if (!found) return reply.code(404).send({ message: "Transaction not found" });

        await db.none(SQL.delete, [id]);
        await db.none("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_summary");

        return reply.send({ message: "Transaction deleted", id });
    });

    fastify.get("/summary/monthly", async (_, reply) => {
        const summary = await db.any(
            `SELECT to_char(month, 'YYYY-MM') AS month, total_qty, total_amount
       FROM mv_monthly_summary ORDER BY month DESC`
        );
        return reply.send(summary);
    });

    // Manual refresh mv endpoint
    fastify.post("/summary/monthly/refresh", async (_, reply) => {
        await db.none("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_summary");
        return reply.send({ message: "Materialized view refreshed" });
    });
}
