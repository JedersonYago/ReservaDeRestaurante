import { Router } from "express";
import authRoutes from "./authRoutes";
import reservationRoutes from "./reservationRoutes";
import tableRoutes from "./tableRoutes";
import configRoutes from "./configRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/reservations", reservationRoutes);
router.use("/tables", tableRoutes);
router.use("/config", configRoutes);

export default router;
