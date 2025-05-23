import { Router } from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} from "../controllers/reservationController";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { reservationSchema } from "../validations/schemas";

const router = Router();

// Todas as rotas de reserva requerem autenticação
router.use(auth);

// Rotas de reserva
router.post("/", validate(reservationSchema), createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationById);
router.put("/:id", validate(reservationSchema), updateReservation);
router.delete("/:id", deleteReservation);

export default router;
