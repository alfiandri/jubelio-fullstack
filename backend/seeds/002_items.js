export async function seed(knex) {
    await knex("items").del();

    await knex("items").insert([{
            item_code: "ITEM001",
            item_name: "Keyboard Mechanical",
            price: 650000,
            description: "Mechanical keyboard RGB",
            image: "/uploads/keyboard.jpg",
        },
        {
            item_code: "ITEM002",
            item_name: "Gaming Mouse",
            price: 350000,
            description: "Mouse with high DPI",
            image: "/uploads/mouse.jpg",
        },
    ]);
}