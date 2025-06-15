import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
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

      const token = generateToken(user);

      res.json({
        token,
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

      const token = generateToken(user);

      res.status(201).json({
        token,
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

  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  },
};

export { authController };
