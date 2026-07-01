import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  addCommentHandler,
  getPostCommentsHandler,
} from "./comment.controller";

export const commentRouter = Router();

commentRouter.post(
  "/posts/:postId/comments",
  authMiddleware,
  addCommentHandler,
);
commentRouter.get("/posts/:postId/comments", getPostCommentsHandler);
