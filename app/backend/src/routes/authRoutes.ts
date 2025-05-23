import { Router } from "express";
import { register, login } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validations/schemas";

const router = Router();

router.post("/register", validate(userSchema), register);
router.post(
  "/login",
  validate(userSchema.pick({ username: true, senha: true })),
  login
);

export default router;
