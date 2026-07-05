import { Request, Response } from "express";
import z from "zod";
import {
  createUserSchema,
  cursorPaginationSchema,
  paginationSchema,
  updateUserSchema,
} from "./user.schema";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getAllUsersViaCursor,
  getProfile,
  getUserById,
  updateUser,
} from "./user.service";
import AppError from "../../errors/app-error";

export async function createUserHandler(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await createUser(result.data);
  return res.status(201).json({
    data: response,
  });
}

export async function getAllUsersHandler(req: Request, res: Response) {
  const result = paginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await getAllUsers(result.data);

  return res.status(200).json(response);
}

export async function getUserByIdHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const response = await getUserById(req.params.id);

  return res.status(200).json({ data: response });
}

export async function updateUserHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await updateUser(req.params.id, result.data);

  return res.status(200).json({ data: response });
}

export async function deleteByUserId(
  req: Request<{ id: string }>,
  res: Response,
) {
  await deleteUser(req.params.id);
  return res.status(204).send();
}

export async function getMeHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await getUserById(String(req.user.id));

  return res.status(200).json({ data: response });
}

export async function getAllUsersViaCursorHandler(req: Request, res: Response) {
  const result = cursorPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await getAllUsersViaCursor(result.data);

  return res.status(200).json(response);
}

export async function getProfileHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const response = await getProfile(req.params.id, req.user?.id);

  return res.status(200).json(response);
}
