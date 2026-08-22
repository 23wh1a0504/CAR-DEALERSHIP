import bcrypt from "bcrypt";
import prisma, { assertDatabaseConfigured } from "../utils/prisma";
import AppError from "../utils/AppError";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterInput) {
  assertDatabaseConfigured();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  assertDatabaseConfigured();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(401, "Invalid email or password");
  }

  return user;
}
