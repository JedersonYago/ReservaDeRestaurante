import { reservationSchema as createReservationSchema } from "@restaurant-reservation/shared";
import { z } from "zod";

export type CreateReservationFormData = z.infer<typeof createReservationSchema>;

export { createReservationSchema };
