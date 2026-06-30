import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  deleteLikeHandler,
  getPostLikesCountHandler,
  likePostHandler,
} from "./like.controller";

export const likeRouter = Router();

likeRouter.put("/:postId/like", authMiddleware, likePostHandler);
likeRouter.delete("/:postId/like", authMiddleware, deleteLikeHandler);
likeRouter.get("/:postId/likes/count", getPostLikesCountHandler);
