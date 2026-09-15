import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  completeVideoUploadHandler,
  createVideoCommentHandler,
  createVideoUploadHandler,
  deleteVideoCommentHandler,
  deleteVideoLikeHandler,
  getTrendingVideosHandler,
  getVideoCommentsHandler,
  getVideoFeedHandler,
  getVideoHandler,
  likeVideoHandler,
  publishVideoHandler,
  searchVideosHandler,
  unPublishVideoHandler,
  viewVideoHandler,
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
videoRouter.get("/videos/feed", optionalAuthMiddleware, getVideoFeedHandler);
videoRouter.get("/videos/search", optionalAuthMiddleware, searchVideosHandler);
videoRouter.get(
  "/videos/trending",
  optionalAuthMiddleware,
  getTrendingVideosHandler,
);
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

videoRouter.post("/videos/:videoId/view", authMiddleware, viewVideoHandler);
videoRouter.put("/videos/:videoId/like", authMiddleware, likeVideoHandler);
videoRouter.delete(
  "/videos/:videoId/like",
  authMiddleware,
  deleteVideoLikeHandler,
);

videoRouter.post(
  "/videos/:videoId/comments",
  authMiddleware,
  createVideoCommentHandler,
);
videoRouter.get(
  "/videos/:videoId/comments",
  optionalAuthMiddleware,
  getVideoCommentsHandler,
);
videoRouter.delete(
  "/videos/:videoId/comments/:commentId",
  authMiddleware,
  deleteVideoCommentHandler,
);
