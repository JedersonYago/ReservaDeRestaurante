import { Router } from "express";
import { tableController } from "../controllers/tableController";
import { validateSchema } from "../middlewares/validateSchema";
import { tableSchema } from "../validations/schemas";
import { auth, adminAuth } from "../middlewares/auth";

const router = Router();

// Rotas protegidas
router.use(auth);

router.get("/", tableController.list);
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
router.get("/available", tableController.availableTables);
router.get("/:id/status", tableController.getStatus);

export default router;
