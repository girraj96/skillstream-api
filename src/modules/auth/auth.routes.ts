import { Router } from "express";
import { changePasswordHandler, loginHandler } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authRateLimiter } from "../../middlewares/rate-limit.middleware";

export const authRouter = Router();
authRouter.post("/auth/login", authRateLimiter, loginHandler);
authRouter.patch(
  "/auth/change-password",
  authRateLimiter,
  authMiddleware,
  changePasswordHandler,
);
