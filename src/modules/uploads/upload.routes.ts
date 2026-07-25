import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  cleanupExpiredUploadsHandler,
  completeUploadHandler,
  createImageUploadUrlHandler,
  viewImageUrlHandler,
} from "./upload.controller";
import { requireRole } from "../../middlewares/require-role.middleware";

export const uploadRouter = Router();

uploadRouter.post(
  "/uploads/image-url",
  authMiddleware,
  createImageUploadUrlHandler,
);

uploadRouter.post("/uploads/complete", authMiddleware, completeUploadHandler);

uploadRouter.post("/uploads/view-url", authMiddleware, viewImageUrlHandler);
uploadRouter.post(
  "/admin/uploads/cleanup-expired",
  authMiddleware,
  requireRole("admin"),
  cleanupExpiredUploadsHandler,
);
