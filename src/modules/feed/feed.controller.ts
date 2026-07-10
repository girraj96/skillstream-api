import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import { getFollowingFeed } from "./feed.service";
import { cursorPaginationSchema } from "../../utils/schema";
import z from "zod";

export async function getFollowingFeedHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = cursorPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getFollowingFeed(result.data, String(req.user.id));
  return res.status(200).json(response);
}
