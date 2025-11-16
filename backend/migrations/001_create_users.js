export async function up(knex) {
    await knex.schema.createTable("users", (t) => {
        t.increments("user_id").primary();
        t.string("name").notNullable();
        t.string("email").notNullable().unique();
        t.string("password").notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTable("users");
}