import { Router } from "express";
import {
  getConfig,
  updateConfig,
  getConfigHistory,
} from "../controllers/configController";
import { validateSchema } from "../middlewares/validateSchema";
import { configSchema } from "../validations/schemas";
import { auth, roleAuth } from "../middlewares/auth";

const router = Router();

// Todas as rotas de configuração requerem autenticação e role admin
router.use(auth);
router.use(roleAuth(["admin"]));

// Rotas de configuração
router.get("/", getConfig);
router.get("/history", getConfigHistory);
router.put("/", validateSchema(configSchema), updateConfig);

export default router;
