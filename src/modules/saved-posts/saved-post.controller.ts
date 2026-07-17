import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import { deleteSavedPost, getSavedPosts, savePost } from "./saved-post.service";
import { cursorPostsPaginationSchema } from "../posts/post.schema";
import z from "zod";

export async function savePostHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await savePost(req.params.postId, String(req.user.id));
  return res.status(200).json(response);
}

export async function deleteSavedPostHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  await deleteSavedPost(req.params.postId, String(req.user.id));
  return res.status(204).send();
}

export async function getSavedPostsHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = cursorPostsPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getSavedPosts(result.data, String(req.user.id));
  return res.status(200).json(response);
}
