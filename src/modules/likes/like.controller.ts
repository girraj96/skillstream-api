import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import { deleteLike, getPostLikesCount, likePost } from "./like.service";

export async function likePostHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await likePost(req.params.postId, String(req.user.id));
  return res.status(200).json(response);
}

export async function deleteLikeHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await deleteLike(req.params.postId, String(req.user.id));
  return res.status(200).json(response);
}

export async function getPostLikesCountHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  const response = await getPostLikesCount(req.params.postId);
  return res.status(200).json(response);
}
