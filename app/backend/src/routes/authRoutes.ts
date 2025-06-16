import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateSchema } from "../middlewares/validateSchema";
import { loginSchema, userSchema } from "../validations/schemas";

const router = Router();

// Rotas públicas
router.post("/login", validateSchema(loginSchema), authController.login);
router.post("/register", validateSchema(userSchema), authController.register);

export default router;
