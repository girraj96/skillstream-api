import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  createPostHandler,
  deletePostHandler,
  feedHandler,
  getMyPostsHandler,
  updatePostHandler,
} from "./post.controller";

export const postRouter = Router();

postRouter.post("/", authMiddleware, createPostHandler);
postRouter.get("/feed", feedHandler);
postRouter.get("/me", authMiddleware, getMyPostsHandler);
postRouter.patch("/:id", authMiddleware, updatePostHandler);
postRouter.delete("/:id", authMiddleware, deletePostHandler);
