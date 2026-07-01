import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  followHandler,
  getFollowersHandler,
  getFollowingsHandler,
  unFollowHandler,
} from "./follow.controller";

export const followRouter = Router();

followRouter.put("/users/:id/follow", authMiddleware, followHandler);
followRouter.delete("/users/:id/follow", authMiddleware, unFollowHandler);
followRouter.get("/users/:id/followers", getFollowersHandler);
followRouter.get("/users/:id/following", getFollowingsHandler);
