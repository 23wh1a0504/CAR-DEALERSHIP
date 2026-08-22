import jwt from "jsonwebtoken";
import request from "supertest";

const mockPrisma = { user: { findUnique: jest.fn(), create: jest.fn() }, vehicle: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() } };
jest.mock("../src/utils/prisma", () => ({ __esModule: true, default: mockPrisma, assertDatabaseConfigured: jest.fn() }));
import app from "../src/app";

const vehicle = { id: 1, make: "Toyota", model: "Camry", category: "Sedan", price: 30000, quantity: 2, createdAt: new Date(), updatedAt: new Date() };
const payload = { make: "Toyota", model: "Camry", category: "Sedan", price: 30000, quantity: 2 };
const token = (role: "USER" | "ADMIN" = "USER") => jwt.sign({ id: 1, role }, "test-secret");

describe("vehicle endpoints", () => {
  beforeEach(() => { jest.clearAllMocks(); process.env.JWT_SECRET = "test-secret"; process.env.MYSQL_PASSWORD = "test-password"; process.env.DATABASE_URL = "mysql://root:test-password@localhost:3306/test"; });
  test("requires a token", async () => expect((await request(app).get("/api/vehicles")).status).toBe(401));
  test("creates a vehicle", async () => {
    mockPrisma.vehicle.create.mockResolvedValue(vehicle);
    const response = await request(app).post("/api/vehicles").set("Authorization", `Bearer ${token()}`).send(payload);
    expect(response.status).toBe(201); expect(response.body.vehicle.make).toBe("Toyota");
  });
  test("searches vehicles", async () => {
    mockPrisma.vehicle.findMany.mockResolvedValue([vehicle]);
    const response = await request(app).get("/api/vehicles/search?make=Toyota&minPrice=20000").set("Authorization", `Bearer ${token()}`);
    expect(response.status).toBe(200); expect(response.body.vehicles).toHaveLength(1);
  });
  test("purchases an in-stock vehicle", async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(vehicle); mockPrisma.vehicle.update.mockResolvedValue({ ...vehicle, quantity: 1 });
    const response = await request(app).post("/api/vehicles/1/purchase").set("Authorization", `Bearer ${token()}`);
    expect(response.status).toBe(200); expect(response.body.vehicle.quantity).toBe(1);
  });
  test("rejects purchase of an out-of-stock vehicle", async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue({ ...vehicle, quantity: 0 });
    expect((await request(app).post("/api/vehicles/1/purchase").set("Authorization", `Bearer ${token()}`)).status).toBe(400);
  });
  test("allows only admins to delete or restock", async () => {
    expect((await request(app).delete("/api/vehicles/1").set("Authorization", `Bearer ${token()}`)).status).toBe(403);
    mockPrisma.vehicle.findUnique.mockResolvedValue(vehicle); mockPrisma.vehicle.update.mockResolvedValue({ ...vehicle, quantity: 5 });
    const response = await request(app).post("/api/vehicles/1/restock").set("Authorization", `Bearer ${token("ADMIN")}`).send({ amount: 3 });
    expect(response.status).toBe(200);
  });
});
