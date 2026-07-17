import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  deletePostImageHandler,
  postImageMetaDataHandler,
} from "./post-image.controller";

export const postImageRouter = Router();

postImageRouter.post(
  "/posts/:postId/images",
  authMiddleware,
  postImageMetaDataHandler,
);
postImageRouter.delete(
  "/posts/:postId/images/:imageId",
  authMiddleware,
  deletePostImageHandler,
);
