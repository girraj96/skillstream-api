import { Request, Response } from "express";
import { createUser, getAllUsers, getUserId } from "./user.service";
import { createUserSchema } from "./user.schema";
import z, { ZodError } from "zod";

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
  const response = await getAllUsers();
  return res.status(200).json({ data: response });
}

export async function getUserByIdHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const response = await getUserId(req.params.id);

  return res.status(200).json({ data: response });
}
