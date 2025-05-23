import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "sua_chave_secreta_aqui"
    );
    req.user = decoded as IUser;
    next();
  } catch (error) {
    res.status(401).json({ error: "Por favor, autentique-se." });
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "admin") {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
};
