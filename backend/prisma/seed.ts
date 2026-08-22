import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/utils/prisma";

async function main() {
  const password = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@driveway.local" },
    update: { role: "ADMIN" },
    create: { name: "Dealership Admin", email: "admin@driveway.local", password, role: "ADMIN" },
  });

  const vehicles = [
    { make: "Toyota", model: "Camry", category: "Sedan", price: 30250, quantity: 4 },
    { make: "Honda", model: "CR-V", category: "SUV", price: 35400, quantity: 3 },
    { make: "Tesla", model: "Model 3", category: "Electric", price: 41990, quantity: 0 },
    { make: "Ford", model: "F-150", category: "Truck", price: 46800, quantity: 2 },
  ];

  for (const vehicle of vehicles) {
    const existing = await prisma.vehicle.findFirst({ where: { make: vehicle.make, model: vehicle.model } });
    if (!existing) await prisma.vehicle.create({ data: vehicle });
  }

  console.log("Seeded admin: admin@driveway.local / Admin123!");
  console.log("Seeded 4 demo vehicles.");
}

main().finally(() => prisma.$disconnect());
