import { Request, Response } from "express";
import {
  createPostSchema,
  cursorPostsPaginationSchema,
  updatePostSchema,
} from "./post.schema";
import z from "zod";
import {
  createPost,
  deletePost,
  getFeed,
  getMyPosts,
  updatePost,
} from "./post.service";
import AppError from "../../errors/app-error";

export async function createPostHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = createPostSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await createPost(result.data, String(req.user.id));
  return res.status(201).json({
    data: response,
  });
}

export async function getMyPostsHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await getMyPosts(String(req.user.id));
  return res.status(200).json(response);
}

export async function updatePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = updatePostSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await updatePost(
    result.data,
    req.params.id,
    String(req.user.id),
  );
  return res.status(200).json(response);
}

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  await deletePost(req.params.id, String(req.user.id));
  return res.status(204).send();
}

export async function feedHandler(req: Request, res: Response) {
  const result = cursorPostsPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getFeed(result.data);
  return res.status(200).json(response);
}
