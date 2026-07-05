import { Router } from "express";
import {
  createUserHandler,
  deleteByUserId,
  getAllUsersHandler,
  getAllUsersViaCursorHandler,
  getMeHandler,
  getProfileHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/require-role.middleware";
import { signupRateLimiter } from "../../middlewares/rate-limit.middleware";
import { optionalAuthMiddleware } from "../../middlewares/optional-auth.middleware";

export const userRouter = Router();

userRouter.post("/users/", signupRateLimiter, createUserHandler);

userRouter.get("/users/me", authMiddleware, getMeHandler);
userRouter.get("/", authMiddleware, requireRole("admin"), getAllUsersHandler);

userRouter.get(
  "/users/cursor",
  authMiddleware,
  requireRole("admin"),
  getAllUsersViaCursorHandler,
);

userRouter.get(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  getUserByIdHandler,
);
userRouter.patch(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  updateUserHandler,
);
userRouter.delete(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  deleteByUserId,
);

userRouter.get("/users/:id/profile", optionalAuthMiddleware, getProfileHandler);
