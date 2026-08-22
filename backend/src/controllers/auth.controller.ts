import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { authenticateUser, registerUser } from "../services/auth.service";
import AppError from "../utils/AppError";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req: Request, res: Response): Promise<void> {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  if (!emailPattern.test(email)) {
    res.status(400).json({ message: "A valid email address is required" });
    return;
  }

  try {
    await registerUser({ name, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({ message: "An account with this email already exists" });
      return;
    }

    throw error;
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const user = await authenticateUser(email, password);
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "replace-with-a-long-random-secret") {
    throw new AppError(500, "JWT_SECRET has not been configured");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
