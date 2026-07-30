import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  completeVideoUploadHandler,
  createVideoUploadHandler,
  getVideoFeedHandler,
  getVideoHandler,
  publishVideoHandler,
  unPublishVideoHandler,
} from "./video.controller";
import { optionalAuthMiddleware } from "../../middlewares/optional-auth.middleware";

export const videoRouter = Router();

videoRouter.post(
  "/videos/upload-url",
  authMiddleware,
  createVideoUploadHandler,
);

videoRouter.post(
  "/videos/:videoId/complete-upload",
  authMiddleware,
  completeVideoUploadHandler,
);
videoRouter.get("/videos/feed", getVideoFeedHandler);

videoRouter.get("/videos/:videoId", optionalAuthMiddleware, getVideoHandler);

videoRouter.put(
  "/videos/:videoId/publish",
  authMiddleware,
  publishVideoHandler,
);
videoRouter.put(
  "/videos/:videoId/unpublish",
  authMiddleware,
  unPublishVideoHandler,
);
