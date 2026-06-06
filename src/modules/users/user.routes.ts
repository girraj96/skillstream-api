import { Router } from "express";
import {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
} from "./user.controller";

export const userRouter = Router();

userRouter.post("/", createUserHandler);
userRouter.get("/", getAllUsersHandler);
userRouter.get("/:id", getUserByIdHandler);
