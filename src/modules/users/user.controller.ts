import { Request, Response } from "express";
import { createUser, getAllUsers, getUserId } from "./user.service";
import { createUserSchema, paginationSchema } from "./user.schema";
import z from "zod";

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
  const response = await getUserId(req.params.id);

  return res.status(200).json({ data: response });
}
