import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";

const mockPrisma = { user: { findUnique: jest.fn(), create: jest.fn() }, vehicle: {} };
jest.mock("../src/utils/prisma", () => ({ __esModule: true, default: mockPrisma }));
import app from "../src/app";

const registration = { name: "John", email: "john@example.com", password: "password123" };

describe("authentication endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockImplementation(async ({ data }) => ({ id: 1, role: "USER", ...data }));
  });

  test("registers a new user", async () => {
    const response = await request(app).post("/api/auth/register").send(registration);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  test("rejects duplicate emails", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: registration.email });
    expect((await request(app).post("/api/auth/register").send(registration)).status).toBe(409);
  });

  test.each([
    [{ email: registration.email, password: registration.password }],
    [{ name: registration.name, password: registration.password }],
    [{ name: registration.name, email: registration.email }],
    [{ ...registration, email: "not-an-email" }],
  ])("rejects invalid registration data", async (payload) => {
    expect((await request(app).post("/api/auth/register").send(payload)).status).toBe(400);
  });

  test("logs in with valid credentials and returns a JWT", async () => {
    const password = await bcrypt.hash(registration.password, 4);
    mockPrisma.user.findUnique.mockResolvedValue({ id: 4, name: "John", email: registration.email, password, role: "USER" });
    const response = await request(app).post("/api/auth/login").send({ email: registration.email, password: registration.password });
    expect(response.status).toBe(200);
    expect(jwt.verify(response.body.token, "test-secret")).toMatchObject({ id: 4, role: "USER" });
  });

  test("rejects invalid login credentials", async () => {
    expect((await request(app).post("/api/auth/login").send({ email: registration.email, password: "wrong-password" })).status).toBe(401);
  });
});
