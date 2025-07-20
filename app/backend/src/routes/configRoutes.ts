import { Router } from "express";
import {
  getConfig,
  getPublicConfig,
  updateConfig,
  getConfigHistory,
} from "../controllers/configController";
import { validateSchema } from "../middlewares/validateSchema";
import { configSchema } from "../validations/schemas";
import { auth, roleAuth } from "../middlewares/auth";

const router = Router();

// Rota de configurações básicas - apenas configurações não sensíveis necessárias para a UI
router.get("/public", getPublicConfig);

// Rota de configuração completa - requer autenticação
router.get("/", auth, roleAuth(["admin"]), getConfig);

// Rotas administrativas - restritas aos admins
router.get("/history", auth, roleAuth(["admin"]), getConfigHistory);
router.put(
  "/",
  auth,
  roleAuth(["admin"]),
  validateSchema(configSchema),
  updateConfig
);

export default router;
