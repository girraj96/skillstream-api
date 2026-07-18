import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { createImageUploadUrlHandler } from "./upload.controller";

export const uploadRouter = Router();

uploadRouter.post(
  "/uploads/image-url",
  authMiddleware,
  createImageUploadUrlHandler,
);
