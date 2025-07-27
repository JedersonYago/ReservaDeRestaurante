import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("🔧 Validação de schema:", {
      url: req.url,
      method: req.method,
      body: req.body,
      contentType: req.headers["content-type"],
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.log("❌ Validação falhou:", result.error.issues);
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
    console.log("✅ Validação passou");
    req.body = result.data;
    next();
  };
};
