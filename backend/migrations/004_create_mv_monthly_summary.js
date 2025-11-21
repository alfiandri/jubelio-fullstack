exports.up = async function (knex) {
    await knex.raw(`
        CREATE MATERIALIZED VIEW mv_monthly_summary AS
        SELECT
            date_trunc('month', created_date) AS month,
            SUM(qty) AS total_qty,
            SUM(amount) AS total_amount
        FROM transactions
        GROUP BY 1
        ORDER BY 1 DESC;
    `);

    await knex.raw(`
        CREATE UNIQUE INDEX mv_monthly_summary_month_idx
        ON mv_monthly_summary (month);
    `);

    await knex.raw(`
        REFRESH MATERIALIZED VIEW mv_monthly_summary;
    `);
};

exports.down = async function (knex) {
    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS mv_monthly_summary CASCADE;`);
};