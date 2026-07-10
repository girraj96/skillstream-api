import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { getFollowingFeedHandler } from "./feed.controller";

export const feedRouter = Router();

feedRouter.get("/feed/following", authMiddleware, getFollowingFeedHandler);
