import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  deleteLikeHandler,
  getPostLikesCountHandler,
  likePostHandler,
} from "./like.controller";

export const likeRouter = Router();

likeRouter.put("/posts/:postId/like", authMiddleware, likePostHandler);
likeRouter.delete("/posts/:postId/like", authMiddleware, deleteLikeHandler);
likeRouter.get("/posts/:postId/likes/count", getPostLikesCountHandler);
