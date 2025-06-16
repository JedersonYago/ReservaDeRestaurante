import jwt from "jsonwebtoken";
import { config } from "../config";
import { IUser } from "../models/User";

if (!config.auth.jwtSecret) {
  throw new Error("JWT_SECRET não está configurado");
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

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.auth.jwtSecret as jwt.Secret);
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};
