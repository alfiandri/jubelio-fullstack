export async function up(knex) {
    await knex.schema.createTable("items", (table) => {
        table.increments("item_id").primary();
        table.string("item_code").notNullable().unique();
        table.string("item_name").notNullable();
        table.decimal("price", 12, 2).notNullable();
        table.text("description");
        table.text("image");
        table.timestamps(true, true);
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("items");
}