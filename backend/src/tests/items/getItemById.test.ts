import request from "supertest";
import { buildTestApp } from "../helpers/testApp";

describe("GET /items/:id", () => {
    let app: any;
    let client: any;

    beforeAll(async () => {
        app = await buildTestApp();
        client = request(app.server);
    });

    afterAll(async () => {
        await app.close();
    });

    it("returns 200 and item when found", async () => {
        const res = await client
            .get("/items/1")
            .set("Authorization", "Bearer test-token");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("item_id");
    });

    it("returns 404 when not found", async () => {
        const res = await client
            .get("/items/99999")
            .set("Authorization", "Bearer test-token");

        expect(res.status).toBe(404);
    });
});
