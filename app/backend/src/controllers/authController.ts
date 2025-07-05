import { Request, Response } from "express";
import User from "../models/User";
import RefreshToken from "../models/RefreshToken";
import {
  generateTokenPair,
  verifyRefreshToken,
  isTokenExpired,
} from "../utils/jwt";
import { config } from "../config";

const authController = {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

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
      console.error("[authController.login] Erro:", error);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { name, username, email, password, role, adminCode } = req.body;

      if (role === "admin" && adminCode !== config.auth.adminCode) {
        return res
          .status(400)
          .json({ message: "Código de administrador inválido" });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Já existe um usuário com este email ou nome de usuário",
        });
      }

      const user = await User.create({
        name,
        username,
        email,
        password,
        role,
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
      console.error("[authController.register] Erro:", error);
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
      console.error("[authController.refresh] Erro:", error);
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
      console.error("[authController.logout] Erro:", error);
      res.status(500).json({ message: "Erro ao fazer logout" });
    }
  },

  async logoutAll(req: Request, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      // Revogar todos os refresh tokens do usuário
      await RefreshToken.updateMany(
        { userId: req.user._id },
        { isRevoked: true }
      );

      res.json({
        message: "Logout de todos os dispositivos realizado com sucesso",
      });
    } catch (error) {
      console.error("[authController.logoutAll] Erro:", error);
      res
        .status(500)
        .json({ message: "Erro ao fazer logout de todos os dispositivos" });
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      console.error("[authController.getCurrentUser] Erro:", error);
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
      console.error("[authController.validateToken] Erro:", error);
      res.status(401).json({ valid: false, message: "Token inválido" });
    }
  },
};

export { authController };
