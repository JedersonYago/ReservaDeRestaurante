import { Router } from "express";
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
} from "../controllers/tableController";
import { auth, isAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { tableSchema } from "../validations/schemas";

const router = Router();

// Todas as rotas de mesa requerem autenticação
router.use(auth);

// Rotas que requerem autenticação de admin
router.post("/", isAdmin, validate(tableSchema), createTable);
router.put("/:id", isAdmin, validate(tableSchema), updateTable);
router.delete("/:id", isAdmin, deleteTable);

// Rotas que requerem apenas autenticação
router.get("/", getAllTables);
router.get("/:id", getTableById);

export default router;
