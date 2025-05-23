import { Router } from "express";
import { register, login } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validations/schemas";
import Joi from "joi";

const router = Router();

const loginSchema = Joi.object({
  username: Joi.string().required(),
  senha: Joi.string().required(),
});

router.post("/register", validate(userSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
