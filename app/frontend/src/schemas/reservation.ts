import * as yup from "yup";

export const createReservationSchema = yup.object({
  date: yup.string().required("Data é obrigatória"),
  time: yup.string().required("Horário é obrigatório"),
  numberOfPeople: yup
    .number()
    .required("Número de pessoas é obrigatório")
    .min(1, "Mínimo de 1 pessoa")
    .max(20, "Máximo de 20 pessoas"),
  name: yup.string().required("Nome é obrigatório"),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(
      /^\(\d{2}\) \d{5}-\d{4}$/,
      "Telefone deve estar no formato (00) 00000-0000"
    ),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
});

export const updateReservationSchema = yup.object({
  date: yup.string(),
  time: yup.string(),
  numberOfPeople: yup
    .number()
    .min(1, "Mínimo de 1 pessoa")
    .max(20, "Máximo de 20 pessoas"),
  name: yup.string(),
  phone: yup
    .string()
    .matches(
      /^\(\d{2}\) \d{5}-\d{4}$/,
      "Telefone deve estar no formato (00) 00000-0000"
    ),
  email: yup.string().email("Email inválido"),
});
