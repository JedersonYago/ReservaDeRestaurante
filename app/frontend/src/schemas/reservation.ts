import { z } from "zod";

export const createReservationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Horário inválido. Use o formato HH:mm"
    ),
  tableId: z.string().min(1, "A mesa é obrigatória"),
  customerName: z.string().min(1, "O nome do cliente é obrigatório"),
  customerEmail: z.string().email("Email inválido"),
  observations: z.string().optional(),
});

export type CreateReservationFormData = z.infer<typeof createReservationSchema>;
