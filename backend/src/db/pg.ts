import pgPromise from 'pg-promise';
import { env } from '../config/env';


const pgp = pgPromise({ noWarnings: true });
export const db = pgp({
    host: env.PG_HOST,
    port: env.PG_PORT,
    database: env.PG_DB,
    user: env.PG_USER,
    password: env.PG_PASSWORD
});


export async function withTx<T>(fn: (t: pgPromise.ITask<{}>) => Promise<T>) {
    return db.tx(fn);
}