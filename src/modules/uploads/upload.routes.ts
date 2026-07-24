import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  completeUploadHandler,
  createImageUploadUrlHandler,
  viewImageUrlHandler,
} from "./upload.controller";

export const uploadRouter = Router();

uploadRouter.post(
  "/uploads/image-url",
  authMiddleware,
  createImageUploadUrlHandler,
);

uploadRouter.post("/uploads/complete", authMiddleware, completeUploadHandler);

uploadRouter.post("/uploads/view-url", authMiddleware, viewImageUrlHandler);
