import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import {
  cleanupExpiredUploads,
  completeUpload,
  createImageUploadUrl,
  viewImageUrl,
} from "./upload.service";
import {
  completeUploadSchema,
  createImageUploadUrlSchema,
  viewImageUrlSchema,
} from "./upload.schema";
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

export async function completeUploadHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = completeUploadSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await completeUpload(String(req.user.id), result.data);

  return res.status(200).json(response);
}

export async function viewImageUrlHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = viewImageUrlSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await viewImageUrl(String(req.user.id), result.data);

  return res.status(200).json(response);
}

export async function cleanupExpiredUploadsHandler(
  req: Request,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await cleanupExpiredUploads(String(req.user.id));

  return res.status(200).json(response);
}
