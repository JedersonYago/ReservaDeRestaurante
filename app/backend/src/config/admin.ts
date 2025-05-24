export const ADMIN_CODE = process.env.ADMIN_CODE || "ADMIN123456";

export const validateAdminCode = (code: string): boolean => {
  return code === ADMIN_CODE;
};
