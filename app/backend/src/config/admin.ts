const isDevelopment = process.env.NODE_ENV !== "production";

export const adminConfig = {
  jwtSecret:
    process.env.JWT_SECRET || (isDevelopment ? "dev-secret-key" : undefined),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  adminCode: process.env.ADMIN_CODE || "admin123",
} as const;

if (!adminConfig.jwtSecret && !isDevelopment) {
  throw new Error(
    "JWT_SECRET é obrigatório para a segurança da aplicação em produção"
  );
}

export const validateAdminCode = (code: string): boolean => {
  return code === adminConfig.adminCode;
};
