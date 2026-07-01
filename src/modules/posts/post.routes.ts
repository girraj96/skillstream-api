import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  createPostHandler,
  deletePostHandler,
  feedHandler,
  getMyPostsHandler,
  searchPostHandler,
  updatePostHandler,
} from "./post.controller";
import { optionalAuthMiddleware } from "../../middlewares/optional-auth.middleware";

export const postRouter = Router();

postRouter.post("/posts/", authMiddleware, createPostHandler);
postRouter.get("/posts/feed", optionalAuthMiddleware, feedHandler);
postRouter.get("/posts/search", optionalAuthMiddleware, searchPostHandler);
postRouter.get("/posts/me", authMiddleware, getMyPostsHandler);
postRouter.patch("/posts/:id", authMiddleware, updatePostHandler);
postRouter.delete("/posts/:id", authMiddleware, deletePostHandler);
