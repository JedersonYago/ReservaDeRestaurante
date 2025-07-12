import { Router } from "express";
import { tableController } from "../controllers/tableController";
import { validateSchema } from "../middlewares/validateSchema";
import { tableSchema } from "../validations/schemas";
import { auth, adminAuth } from "../middlewares/auth";

const router = Router();

// Rotas protegidas
router.use(auth);

router.get("/", tableController.list);

// Rotas específicas devem vir ANTES das rotas com parâmetros
router.get("/available", tableController.availableTables);
router.get(
  "/available-for-rescheduling",
  adminAuth,
  tableController.getAvailableForRescheduling
);
router.post("/force-maintenance", adminAuth, tableController.forceMaintenance);

// Rotas com parâmetros :id devem vir DEPOIS
router.get("/:id", tableController.getById);
router.post(
  "/",
  adminAuth,
  validateSchema(tableSchema),
  tableController.create
);
router.put(
  "/:id",
  adminAuth,
  validateSchema(tableSchema),
  tableController.update
);
router.delete("/:id", adminAuth, tableController.delete);
router.get("/:id/availability", tableController.getAvailability);
router.get("/:id/status", tableController.getStatus);

export default router;
