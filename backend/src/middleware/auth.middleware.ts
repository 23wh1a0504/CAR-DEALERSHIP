import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import AppError from "../utils/AppError";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    next(new AppError(401, "Authentication token is required"));
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as { id: number; role: Role };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired authentication token"));
  }
}

export function requireAdmin(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  if (req.user?.role !== "ADMIN") {
    next(new AppError(403, "Administrator access is required"));
    return;
  }

  next();
}
