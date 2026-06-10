import { Request, Response } from "express";
import { loginUserSchema } from "./auth.schema";
import z from "zod";
import { loginUser } from "./auth.service";

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
