import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
  test("reports that the API is running", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Car Dealership API is running");
  });
});
