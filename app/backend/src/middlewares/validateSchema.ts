import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validateSchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("🔍 Validando schema para:", JSON.stringify(req.body, null, 2));

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.error("❌ Erro de validação Joi:", error.details);

      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        message: errorMessage,
        details: error.details.map((detail) => ({
          path: detail.path,
          message: detail.message,
        })),
      });
    }

    console.log("✅ Validação Joi passou com sucesso");
    next();
  };
};
