import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateSchema } from "../middlewares/validateSchema";
import {
  loginSchema,
  userSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/schemas";
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
router.post("/logout-all", authenticate, authController.logoutAll);

// Rotas de recuperação de senha (públicas)
router.post(
  "/forgot-password",
  authLimiter,
  validateSchema(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validateSchema(resetPasswordSchema),
  authController.resetPassword
);
router.get("/verify-reset-token", authLimiter, authController.verifyResetToken);

// Rotas autenticadas
router.get("/me", authenticate, authController.getCurrentUser);
router.get("/validate", authenticate, authController.validateToken);

// Rotas de gerenciamento de sessões
router.get("/sessions", authenticate, authController.getActiveSessions);
router.delete(
  "/sessions/:sessionId",
  authenticate,
  authController.revokeSession
);

export default router;
