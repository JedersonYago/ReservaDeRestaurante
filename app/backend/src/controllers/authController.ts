import { Request, Response } from "express";
import { getUserModel } from "../models/User";
import RefreshToken from "../models/RefreshToken";
import { PasswordReset } from "../models/PasswordReset";
import { emailService } from "../services/emailService";
import {
  generateTokenPair,
  verifyRefreshToken,
  isTokenExpired,
} from "../utils/jwt";
import { config } from "../config";
import * as crypto from "crypto";

const authController = {
  async login(req: Request, res: Response) {
    const User = getUserModel();
    try {
      const { username, password } = req.body;

      // Normaliza o valor de login
      const loginValue = username.toLowerCase().trim();
      // Busca por username OU email
      let user;
      if (process.env.NODE_ENV === "test") {
        // Função para escapar regex
        function escapeRegex(str: string) {
          return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        const loginRegex = new RegExp(`^${escapeRegex(loginValue)}$`, "i");
        user = await User.findOne({
          $or: [{ username: loginRegex }, { email: loginRegex }],
        });
      } else {
        // Busca com collation para produção
        user = await User.findOne({
          $or: [{ username: loginValue }, { email: loginValue }],
        }).collation({ locale: "en", strength: 2 });
      }
      if (!user) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      // Gerar par de tokens
      const { accessToken, refreshToken } = generateTokenPair(user);

      // Revogar todos os refresh tokens anteriores do usuário
      await RefreshToken.updateMany(
        { userId: user._id, isRevoked: false },
        { isRevoked: true }
      );

      // Salvar novo refresh token no banco
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt,
      });

      res.json({
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const {
        name,
        username,
        email,
        password,
        confirmPassword,
        role,
        adminCode,
      } = req.body;

      // Remover confirmPassword do body para não interferir na validação
      delete req.body.confirmPassword;

      const User = getUserModel();
      // Verificação case-insensitive para email e username
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() },
        ],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Já existe um usuário com este email ou nome de usuário",
        });
      }

      let finalRole: "client" | "admin" = "client";
      if (role === "admin") {
        if (adminCode !== config.auth.adminCode) {
          return res
            .status(400)
            .json({ message: "Código de administrador inválido" });
        }
        finalRole = "admin";
      }

      const user = await User.create({
        name,
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password,
        role: finalRole,
      });

      // Gerar par de tokens
      const { accessToken, refreshToken } = generateTokenPair(user);

      // Salvar refresh token no banco
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt,
      });

      res.status(201).json({
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token é obrigatório" });
      }

      // Verificar se o refresh token é válido
      const decoded = verifyRefreshToken(refreshToken);

      // Verificar se o token existe no banco e não foi revogado
      const { getUserModel } = await import("../models/User");
      const User = getUserModel();
      const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        isRevoked: false,
      });

      if (!storedToken) {
        return res
          .status(401)
          .json({ message: "Refresh token inválido ou revogado" });
      }

      // Verificar se o token não expirou
      if (new Date() > storedToken.expiresAt) {
        await RefreshToken.findByIdAndUpdate(storedToken._id, {
          isRevoked: true,
        });
        return res.status(401).json({ message: "Refresh token expirado" });
      }

      // Buscar usuário
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      // Gerar novo par de tokens
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        generateTokenPair(user);

      // Revogar token antigo
      await RefreshToken.findByIdAndUpdate(storedToken._id, {
        isRevoked: true,
      });

      // Salvar novo refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await RefreshToken.create({
        userId: user._id,
        token: newRefreshToken,
        expiresAt,
      });

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(401).json({ message: "Erro ao renovar token" });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Revogar refresh token
        await RefreshToken.findOneAndUpdate(
          { token: refreshToken },
          { isRevoked: true }
        );
      }

      res.json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao fazer logout" });
    }
  },

  async logoutAll(req: Request, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      await RefreshToken.updateMany(
        { userId: req.user._id },
        { isRevoked: true }
      );
      res.json({
        message: "Logout de todos os dispositivos realizado com sucesso",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao fazer logout de todos os dispositivos" });
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const { getUserModel } = await import("../models/User");
      const User = getUserModel();
      const user = await User.findById(req.user?._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  },

  async validateToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ valid: false, message: "Token não fornecido" });
      }

      if (isTokenExpired(token)) {
        return res
          .status(401)
          .json({ valid: false, message: "Token expirado" });
      }

      res.json({ valid: true, message: "Token válido" });
    } catch (error) {
      res.status(401).json({ valid: false, message: "Token inválido" });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" });
      }

      // Buscar usuário pelo email (case-insensitive)
      const { getUserModel } = await import("../models/User");
      const User = getUserModel();
      const user = await User.findOne({
        email: email.toLowerCase().trim(),
      });

      if (!user) {
        // Por segurança, sempre retorna sucesso mesmo se o email não existir
        return res.json({
          message:
            "Se o email estiver cadastrado, você receberá as instruções de recuperação",
        });
      }

      // Gerar token único de recuperação
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Definir expiração para 1 hora
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Invalidar tokens anteriores para este usuário
      await PasswordReset.updateMany(
        { userId: user._id, used: false },
        { used: true }
      );

      // Criar novo token de recuperação
      await PasswordReset.create({
        userId: user._id,
        token: resetToken,
        expiresAt,
      });

      // Gerar link de recuperação
      const frontendUrl =
        process.env.FRONTEND_URL || "https://suareservafacil.vercel.app";
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

      // Enviar email
      const emailSent = await emailService.sendPasswordResetEmail(
        user.email,
        resetLink,
        user.username // <-- Agora usa o username único
      );

      if (!emailSent) {
        return res.status(500).json({
          message: "Erro ao enviar email. Tente novamente mais tarde.",
        });
      }

      res.json({
        message:
          "Se o email estiver cadastrado, você receberá as instruções de recuperação",
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno. Tente novamente." });
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          message: "Token e nova senha são obrigatórios",
        });
      }

      // Buscar token de recuperação
      const resetToken = await PasswordReset.findOne({
        token,
        used: false,
      }).populate("userId");

      if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
        return res.status(400).json({
          message: "Token inválido ou expirado",
        });
      }

      // Buscar usuário
      const { getUserModel } = await import("../models/User");
      const User = getUserModel();
      const user = await User.findById(resetToken.userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Atualizar senha do usuário
      user.password = newPassword;
      await user.save();

      // Marcar token como usado
      resetToken.used = true;
      await resetToken.save();

      // Revogar todos os refresh tokens do usuário (forçar novo login)
      await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

      res.json({
        message: "Senha redefinida com sucesso! Faça login com sua nova senha.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao redefinir senha. Tente novamente." });
    }
  },

  async verifyResetToken(req: Request, res: Response) {
    try {
      const { token } = req.query;
      console.log("[verifyResetToken] Token recebido:", token);

      if (!token) {
        console.log("[verifyResetToken] Token não fornecido");
        return res.status(400).json({
          valid: false,
          message: "Token não fornecido",
        });
      }

      // Buscar token de recuperação
      const resetToken = await PasswordReset.findOne({
        token,
        used: false,
      });

      console.log(
        "[verifyResetToken] Token encontrado no banco:",
        resetToken ? "SIM" : "NÃO"
      );

      if (resetToken) {
        console.log("[verifyResetToken] Token usado:", resetToken.used);
        console.log(
          "[verifyResetToken] Token expira em:",
          resetToken.expiresAt
        );
        console.log("[verifyResetToken] Data atual:", new Date());
        console.log(
          "[verifyResetToken] Token expirado:",
          new Date() > resetToken.expiresAt
        );
      }

      if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
        console.log("[verifyResetToken] Token inválido ou expirado");
        return res.status(400).json({
          valid: false,
          message: "Token inválido ou expirado",
        });
      }

      console.log("[verifyResetToken] Token válido");
      res.json({
        valid: true,
        message: "Token válido",
        expiresAt: resetToken.expiresAt,
      });
    } catch (error) {
      console.error("[verifyResetToken] Erro:", error);
      res.status(500).json({
        valid: false,
        message: "Erro ao verificar token",
      });
    }
  },
};

export { authController };
