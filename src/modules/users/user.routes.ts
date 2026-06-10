import { Router } from "express";
import {
  createUserHandler,
  deleteByUserId,
  getAllUsersHandler,
  getMeHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.post("/", createUserHandler);
userRouter.get("/", getAllUsersHandler);

userRouter.get("/me", authMiddleware, getMeHandler);

userRouter.get("/:id", getUserByIdHandler);
userRouter.patch("/:id", updateUserHandler);
userRouter.delete("/:id", deleteByUserId);
