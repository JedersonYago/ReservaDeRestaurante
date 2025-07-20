import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorDetails = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      const errorMessage = errorDetails.map((e) => e.message).join(", ");
      return res.status(400).json({
        message: errorMessage,
        details: errorDetails,
      });
    }
    req.body = result.data;
    next();
  };
};
