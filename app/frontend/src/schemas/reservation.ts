import * as yup from "yup";
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
} from "../utils/validationPatterns";

export const createReservationSchema = yup.object({
  date: yup
    .string()
    .matches(VALIDATION_PATTERNS.DATE, VALIDATION_MESSAGES.DATE)
    .required("Data é obrigatória"),
  time: yup
    .string()
    .matches(VALIDATION_PATTERNS.TIME, VALIDATION_MESSAGES.TIME)
    .required("Horário é obrigatório"),
  tableId: yup.string().required("A mesa é obrigatória"),
  customerName: yup.string().required("O nome do cliente é obrigatório"),
  customerEmail: yup
    .string()
    .email("Email inválido")
    .required("O email do cliente é obrigatório"),
  observations: yup.string(),
});

export type CreateReservationFormData = yup.InferType<
  typeof createReservationSchema
>;
