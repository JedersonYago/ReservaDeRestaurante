import { Router } from "express";
import {
  listReservations,
  getReservationById,
  createReservation,
  deleteReservation,
  clearReservation,
  cancelReservation,
  getAvailableTimes,
  confirmReservation,
} from "../controllers/reservationController";
import { auth, adminAuth } from "../middlewares/auth";
import { validateSchema } from "../middlewares/validateSchema";
import { reservationSchema } from "../validations/schemas";

const router = Router();

// Rotas gerais
router.get("/", auth, listReservations);
router.get("/:id", auth, getReservationById);
router.post("/", auth, validateSchema(reservationSchema), createReservation);
router.put("/:id/cancel", auth, cancelReservation);

router.patch("/:id/clear", auth, clearReservation);
router.delete("/:id", auth, adminAuth, deleteReservation);
router.get("/available-times/:date", getAvailableTimes);
router.put("/:id/confirm", auth, confirmReservation);

export default router;
