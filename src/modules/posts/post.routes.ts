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

postRouter.post("/", authMiddleware, createPostHandler);
postRouter.get("/feed", optionalAuthMiddleware, feedHandler);
postRouter.get("/search", optionalAuthMiddleware, searchPostHandler);
postRouter.get("/me", authMiddleware, getMyPostsHandler);
postRouter.patch("/:id", authMiddleware, updatePostHandler);
postRouter.delete("/:id", authMiddleware, deletePostHandler);
