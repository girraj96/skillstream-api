import { Router } from "express";
import { changePasswordHandler, loginHandler } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const authRouter = Router();
authRouter.post("/login", loginHandler);
authRouter.patch("/change-password", authMiddleware, changePasswordHandler);
