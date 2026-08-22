import type { Request, Response } from "express";
import AppError from "../utils/AppError";
import { createVehicle, deleteVehicle, listVehicles, purchaseVehicle, restockVehicle, updateVehicle } from "../services/vehicle.service";

const vehicleFields = ["make", "model", "category", "price", "quantity"] as const;

function vehicleInput(body: Record<string, unknown>, partial = false) {
  const input: Record<string, string | number> = {};
  for (const field of vehicleFields) {
    if (body[field] === undefined && partial) continue;
    if (field === "price" || field === "quantity") {
      const value = Number(body[field]);
      if (!Number.isFinite(value) || (field === "quantity" && (!Number.isInteger(value) || value < 0)) || (field === "price" && value < 0)) {
        throw new AppError(400, `${field} must be a valid non-negative ${field === "quantity" ? "integer" : "number"}`);
      }
      input[field] = value;
    } else {
      const value = typeof body[field] === "string" ? body[field].trim() : "";
      if (!value) throw new AppError(400, `${field} is required`);
      input[field] = value;
    }
  }
  return input;
}

function idFrom(req: Request) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, "Vehicle id must be a positive integer");
  return id;
}

export async function create(req: Request, res: Response) {
  const vehicle = await createVehicle(vehicleInput(req.body) as never);
  res.status(201).json({ vehicle });
}

export async function list(req: Request, res: Response) {
  const vehicles = await listVehicles({});
  res.json({ vehicles });
}

export async function search(req: Request, res: Response) {
  const query = req.query;
  const minPrice = query.minPrice === undefined ? undefined : Number(query.minPrice);
  const maxPrice = query.maxPrice === undefined ? undefined : Number(query.maxPrice);
  if ((minPrice !== undefined && !Number.isFinite(minPrice)) || (maxPrice !== undefined && !Number.isFinite(maxPrice))) {
    throw new AppError(400, "Price filters must be numbers");
  }
  const vehicles = await listVehicles({
    make: typeof query.make === "string" ? query.make : undefined,
    model: typeof query.model === "string" ? query.model : undefined,
    category: typeof query.category === "string" ? query.category : undefined,
    minPrice,
    maxPrice,
  });
  res.json({ vehicles });
}

export async function update(req: Request, res: Response) {
  const vehicle = await updateVehicle(idFrom(req), vehicleInput(req.body, true) as never);
  res.json({ vehicle });
}

export async function remove(req: Request, res: Response) {
  await deleteVehicle(idFrom(req));
  res.status(204).send();
}

export async function purchase(req: Request, res: Response) {
  const vehicle = await purchaseVehicle(idFrom(req));
  res.json({ vehicle, message: "Vehicle purchased successfully" });
}

export async function restock(req: Request, res: Response) {
  const amount = Number(req.body.amount);
  if (!Number.isInteger(amount) || amount < 1) throw new AppError(400, "amount must be a positive integer");
  const vehicle = await restockVehicle(idFrom(req), amount);
  res.json({ vehicle, message: "Vehicle restocked successfully" });
}
