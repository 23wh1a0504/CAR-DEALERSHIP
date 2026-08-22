import { Router } from "express";
import { create, list, purchase, remove, restock, search, update } from "../controllers/vehicle.controller";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.post("/", create);
router.get("/", list);
router.get("/search", search);
router.put("/:id", update);
router.delete("/:id", requireAdmin, remove);
router.post("/:id/purchase", purchase);
router.post("/:id/restock", requireAdmin, restock);

export default router;
