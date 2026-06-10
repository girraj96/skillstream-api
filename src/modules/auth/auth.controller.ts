import { Request, Response } from "express";
import { changePasswordSchema, loginUserSchema } from "./auth.schema";
import z from "zod";
import { changePassword, loginUser } from "./auth.service";
import AppError from "../../errors/app-error";

export async function loginHandler(req: Request, res: Response) {
  const result = loginUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation Failed",
      error: z.treeifyError(result.error),
    });
  }
  const response = await loginUser(result.data);
  return res.status(200).json({ data: response });
}

export async function changePasswordHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation Failed",
      error: z.treeifyError(result.error),
    });
  }

  const response = await changePassword(result.data, String(req.user.id));
  return res.status(200).json(response);
}
