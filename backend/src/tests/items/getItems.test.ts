import request from "supertest";
import { buildTestApp } from "../helpers/testApp";

describe("GET /items", () => {
    let app: any;
    let client: any;

    beforeAll(async () => {
        app = await buildTestApp();
        client = request(app.server);
    });

    afterAll(async () => {
        await app.close();
    });

    it("returns items list", async () => {
        const res = await client
            .get("/items")
            .set("Authorization", "Bearer test-token");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
