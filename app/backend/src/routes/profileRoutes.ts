import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema";
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "../validations/schemas";
import { auth } from "../middlewares/auth";
import { profileController } from "../controllers/profileController";

const router = Router();

// Todas as rotas de perfil requerem autenticação
router.use(auth);

// Rotas de perfil
router.get("/:username", profileController.getProfile);
router.put(
  "/:username",
  validateSchema(updateProfileSchema),
  profileController.updateProfile
);
router.put(
  "/:username/password",
  validateSchema(changePasswordSchema),
  profileController.changePassword
);
router.put("/:username/change-username", profileController.changeUsername);
router.delete(
  "/:username",
  validateSchema(deleteAccountSchema),
  profileController.deleteAccount
);

export default router;
