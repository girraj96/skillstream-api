import { Router } from "express";
import {
  createUserHandler,
  deleteByUserId,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "./user.controller";

export const userRouter = Router();

userRouter.post("/", createUserHandler);
userRouter.get("/", getAllUsersHandler);

userRouter.get("/:id", getUserByIdHandler);
userRouter.patch("/:id", updateUserHandler);
userRouter.delete("/:id", deleteByUserId);
