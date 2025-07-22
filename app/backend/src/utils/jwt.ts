export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(
      token,
      config.auth.jwtSecret as jwt.Secret
    ) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expirado");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Token inválido");
    }
    throw new Error("Erro ao verificar token");
  }
};
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IUser } from "../models/User";

if (!config.auth.jwtSecret) {
  throw new Error("JWT_SECRET não está configurado");
}

export interface TokenPayload {
  _id: string;
  role: string;
  username: string;
  type: "access" | "refresh";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateToken = (user: IUser): string => {
  const payload = {
    _id: user._id,
    role: user.role,
    username: user.username,
  };

  return jwt.sign(payload, config.auth.jwtSecret as jwt.Secret, {
    expiresIn: config.auth.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generateTokenPair = (user: IUser): TokenPair => {
  const accessPayload: TokenPayload = {
    _id: user._id,
    role: user.role,
    username: user.username,
    type: "access",
  };

  // Adiciona um campo jti aleatório para garantir unicidade do refresh token
  const refreshPayload: TokenPayload & { jti: string } = {
    _id: user._id,
    role: user.role,
    username: user.username,
    type: "refresh",
    jti: Math.random().toString(36).substring(2) + Date.now().toString(36),
  };

  const accessToken = jwt.sign(
    accessPayload,
    config.auth.jwtSecret as jwt.Secret,
    {
      expiresIn: config.auth.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    }
  );

  const refreshToken = jwt.sign(
    refreshPayload,
    config.auth.jwtSecret as jwt.Secret,
    {
      expiresIn: config.auth.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"],
    }
  );

  return { accessToken, refreshToken };
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.auth.jwtSecret as jwt.Secret
    ) as TokenPayload;

    if (decoded.type !== "refresh") {
      throw new Error("Token não é um refresh token");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Refresh token expirado");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Refresh token inválido");
    }
    throw error;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
