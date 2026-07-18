import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import { createImageUploadUrl } from "./upload.service";
import { createImageUploadUrlSchema } from "./upload.schema";
import z from "zod";

export async function createImageUploadUrlHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = createImageUploadUrlSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await createImageUploadUrl(String(req.user.id), result.data);
  return res.status(201).json(response);
}
