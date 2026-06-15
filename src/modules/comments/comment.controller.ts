import { Request, Response } from "express";
import z from "zod";
import AppError from "../../errors/app-error";
import {
  commentSchema,
  cursorCommentsPaginationSchema,
} from "./comment.schema";
import { addComment, getPostComments } from "./comment.service";

export async function addCommentHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = commentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await addComment(
    result.data,
    req.params.postId,
    String(req.user.id),
  );
  return res.status(201).json({
    data: response,
  });
}

export async function getPostCommentsHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  const result = cursorCommentsPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getPostComments(result.data, req.params.postId);
  return res.status(200).json(response);
}
