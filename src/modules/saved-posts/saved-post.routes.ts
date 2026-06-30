import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  deleteSavedPostHandler,
  getSavedPostsHandler,
  savePostHandler,
} from "./saved-post.controller";

export const savePostRouter = Router();

savePostRouter.put("/posts/:postId/save", authMiddleware, savePostHandler);
savePostRouter.delete(
  "/posts/:postId/save",
  authMiddleware,
  deleteSavedPostHandler,
);
savePostRouter.get(
  "/users/me/saved-posts",
  authMiddleware,
  getSavedPostsHandler,
);
