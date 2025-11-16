import bcrypt from "bcrypt";

export async function seed(knex) {
    await knex("users").del();

    await knex("users").insert([{
        email: "admin@demo.local",
        password: await bcrypt.hash("admin123", 10),
        name: "Admin User",
    }, ]);
}