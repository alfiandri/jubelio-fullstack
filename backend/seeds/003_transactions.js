export async function seed(knex) {
    await knex("transactions").del();

    await knex("transactions").insert([{
            item_id: 1,
            qty: 2,
            amount: 2 * 650000,
            created_date: knex.fn.now(),
        },
        {
            item_id: 2,
            qty: 1,
            amount: 350000,
            created_date: knex.fn.now(),
        },
    ]);
}