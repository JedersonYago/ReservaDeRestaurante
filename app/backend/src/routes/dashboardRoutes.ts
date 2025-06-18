import { Router } from "express";
import {
  getClientStats,
  getAdminStats,
} from "../controllers/dashboardController";
import { auth, adminAuth } from "../middlewares/auth";

const router = Router();

// Estatísticas do cliente
router.get("/client", auth, getClientStats);

// Estatísticas do admin (protegida)
router.get("/admin", auth, adminAuth, getAdminStats);

export default router;
