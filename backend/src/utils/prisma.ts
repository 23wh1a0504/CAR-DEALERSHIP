import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import AppError from "./AppError";

const adapter = new PrismaMariaDb({
  host: process.env.MYSQL_HOST ?? "localhost",
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE ?? "car_dealership",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export function assertDatabaseConfigured(): void {
  const password = process.env.MYSQL_PASSWORD;
  const url = process.env.DATABASE_URL;
  if (!password || password.includes("YOUR_MYSQL_PASSWORD") || !url || url.includes("YOUR_MYSQL_PASSWORD")) {
    throw new AppError(503, "Database is not configured. Set your MySQL password in backend/.env, then run Prisma migration and seed commands.");
  }
}

export default prisma;
