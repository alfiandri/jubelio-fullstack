exports.up = async function (knex) {
    await knex.schema.raw(`
      CREATE TABLE transactions (
          trx_id SERIAL,
          item_id INTEGER NOT NULL REFERENCES items(item_id),
          qty INTEGER NOT NULL,
          amount NUMERIC(12,2) NOT NULL,
          created_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
  `);

    await knex.schema.raw(`
      SELECT create_hypertable('transactions', 'created_date', if_not_exists => TRUE);
  `);

    await knex.schema.raw(`
      ALTER TABLE transactions
      ADD PRIMARY KEY (trx_id, created_date);
  `);
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("transactions");
};