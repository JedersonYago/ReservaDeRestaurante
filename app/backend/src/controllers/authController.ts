import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, username, senha, role } = req.body;

    // Verificar se usuário já existe
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Email ou nome de usuário já existe" });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Criar usuário
    const user = await User.create({
      nome,
      email,
      username,
      senha: hashedPassword,
      role: role || "cliente",
    });

    // Gerar token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "sua_chave_secreta_aqui",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, senha } = req.body;

    // Verificar se usuário existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "sua_chave_secreta_aqui",
      { expiresIn: "1d" }
    );

    res.json({
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
