import type { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";
import AppError from "../utils/AppError";

export type VehicleInput = {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
};

export const createVehicle = (data: VehicleInput) => prisma.vehicle.create({ data });

export function listVehicles(filters: { make?: string; model?: string; category?: string; minPrice?: number; maxPrice?: number }) {
  const where: Prisma.VehicleWhereInput = {
    ...(filters.make && { make: { contains: filters.make } }),
    ...(filters.model && { model: { contains: filters.model } }),
    ...(filters.category && { category: { contains: filters.category } }),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? { price: { ...(filters.minPrice !== undefined && { gte: filters.minPrice }), ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }) } }
      : {}),
  };
  return prisma.vehicle.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function updateVehicle(id: number, data: Partial<VehicleInput>) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  return prisma.vehicle.update({ where: { id }, data });
}

export async function deleteVehicle(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  await prisma.vehicle.delete({ where: { id } });
}

export async function purchaseVehicle(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  if (vehicle.quantity < 1) throw new AppError(400, "Vehicle is out of stock");
  return prisma.vehicle.update({ where: { id }, data: { quantity: { decrement: 1 } } });
}

export async function restockVehicle(id: number, amount: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new AppError(404, "Vehicle not found");
  return prisma.vehicle.update({ where: { id }, data: { quantity: { increment: amount } } });
}
