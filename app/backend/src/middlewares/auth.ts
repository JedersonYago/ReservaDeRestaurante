import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import User from "../models/User";
import { verifyToken, isTokenExpired } from "../utils/jwt";
import RefreshToken from "../models/RefreshToken";

interface JwtPayload {
  _id: string;
  role: string;
  username: string;
  type: "access" | "refresh";
  refreshTokenId?: string; // ID do refresh token associado
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: string;
        username: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token não fornecido ou formato inválido" });
    }
    const token = authHeader.substring(7).trim(); // Remove "Bearer " e espaços

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    // Verificar se o token expirou
    if (isTokenExpired(token)) {
      return res.status(401).json({ message: "Token expirado" });
    }

    // Verificar e decodificar o token
    const decoded = verifyToken(token) as JwtPayload;

    // Verificar campos obrigatórios
    if (!decoded._id || !decoded.role || !decoded.username) {
      return res
        .status(401)
        .json({ message: "Token inválido (payload incompleto)" });
    }

    // Verificar se é um access token
    if (decoded.type !== "access") {
      return res.status(401).json({ message: "Tipo de token inválido" });
    }

    // Verificar se o refresh token associado foi revogado
    if (decoded.refreshTokenId) {
      const refreshToken = await RefreshToken.findById(decoded.refreshTokenId);
      if (!refreshToken || refreshToken.isRevoked) {
        return res.status(401).json({ message: "Sessão revogada" });
      }
    }

    // Buscar usuário no banco
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Adicionar usuário à requisição
    req.user = {
      _id: user._id,
      role: user.role,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error("[authenticate] Erro:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expirado" });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token inválido" });
    }

    return res.status(401).json({ message: "Erro de autenticação" });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  } catch (error) {
    console.error("[isAdmin] Erro:", error);
    return res.status(500).json({ message: "Erro ao verificar permissões" });
  }
};

// Alias para manter compatibilidade com código existente
export const auth = authenticate;
export const adminAuth = isAdmin;

// Middleware de autorização para roles específicas
export const roleAuth = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  };
};

// Middleware opcional de autenticação (não falha se não autenticado)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(); // Continua sem autenticação
    }

    if (isTokenExpired(token)) {
      return next(); // Continua sem autenticação
    }

    const decoded = verifyToken(token) as JwtPayload;

    if (decoded.type !== "access") {
      return next(); // Continua sem autenticação
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return next(); // Continua sem autenticação
    }

    req.user = {
      _id: user._id,
      role: user.role,
      username: user.username,
    };

    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next();
  }
};
