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

// Rota de leitura de configuração - acessível a todos os usuários autenticados
router.get("/", auth, getConfig);

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
