export async function up(knex) {
    return knex.raw(`CREATE EXTENSION IF NOT EXISTS timescaledb;`);
}

export async function down(knex) {
    return knex.raw(`DROP EXTENSION IF EXISTS timescaledb;`);
}