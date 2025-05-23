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
router.post("/", auth, validate(reservationSchema), createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationById);
router.put("/:id", auth, validate(reservationSchema), updateReservation);
router.delete("/:id", auth, deleteReservation);

export default router;
