import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import {
  allFollowers,
  allFollowings,
  createFollowing,
  unfollowUser,
} from "./follow.service";
import { cursorFollowPaginationSchema } from "./follow.schema";
import z from "zod";

export async function followHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const response = await createFollowing(req.params.id, String(req.user.id));
  return res.status(200).json(response);
}

export async function unFollowHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const response = await unfollowUser(req.params.id, String(req.user.id));
  return res.status(200).json(response);
}

export async function getFollowersHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const result = cursorFollowPaginationSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await allFollowers(result.data, req.params.id);
  return res.status(200).json(response);
}

export async function getFollowingsHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const result = cursorFollowPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await allFollowings(result.data, req.params.id);
  return res.status(200).json(response);
}
