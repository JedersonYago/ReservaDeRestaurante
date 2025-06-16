import { Router } from "express";
import authRoutes from "./authRoutes";
import tableRoutes from "./tableRoutes";
import reservationRoutes from "./reservationRoutes";
import configRoutes from "./configRoutes";
import profileRoutes from "./profileRoutes";

const router = Router();

// Rotas de autenticação
router.use("/auth", authRoutes);

// Rotas de mesa
router.use("/tables", tableRoutes);

// Rotas de reservas
router.use("/reservations", reservationRoutes);

// Rotas de configuração
router.use("/config", configRoutes);

// Rotas de perfil
router.use("/profile", profileRoutes);

export default router;
