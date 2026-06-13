import { Router } from "express";
import {
  createUserHandler,
  deleteByUserId,
  getAllUsersHandler,
  getAllUsersViaCursorHandler,
  getMeHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/require-role.middleware";
import { signupRateLimiter } from "../../middlewares/rate-limit.middleware";

export const userRouter = Router();

userRouter.post("/", signupRateLimiter, createUserHandler);

userRouter.get("/me", authMiddleware, getMeHandler);
userRouter.get("/", authMiddleware, requireRole("admin"), getAllUsersHandler);

userRouter.get(
  "/cursor",
  authMiddleware,
  requireRole("admin"),
  getAllUsersViaCursorHandler,
);

userRouter.get(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  getUserByIdHandler,
);
userRouter.patch(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateUserHandler,
);
userRouter.delete("/:id", authMiddleware, requireRole("admin"), deleteByUserId);
