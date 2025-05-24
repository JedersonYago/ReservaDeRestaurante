import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import { Request } from "../types/custom";

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Por favor, autentique-se." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "sua_chave_secreta_aqui"
    ) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Por favor, autentique-se." });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Acesso negado. Apenas administradores." });
    }
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Acesso negado. Apenas administradores." });
  }
};
