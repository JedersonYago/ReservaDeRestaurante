import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateSchema } from "../middlewares/validateSchema";
import { loginSchema, userSchema } from "../validations/schemas";
import { authenticate } from "../middlewares/auth";
import { authLimiter, refreshLimiter } from "../config/rateLimit";

const router = Router();

// Rotas públicas
router.post(
  "/login",
  authLimiter,
  validateSchema(loginSchema),
  authController.login
);
router.post(
  "/register",
  authLimiter,
  validateSchema(userSchema),
  authController.register
);
router.post("/refresh", refreshLimiter, authController.refresh);
router.post("/logout", authLimiter, authController.logout);

// Rotas protegidas
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/logout-all", authenticate, authController.logoutAll);
router.get("/validate", authenticate, authController.validateToken);

export default router;
