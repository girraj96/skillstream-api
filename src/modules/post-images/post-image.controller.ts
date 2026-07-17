import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import { postImageSchema } from "./post-image.schema";
import z from "zod";
import { deletePostImage, postImageMetaData } from "./post-image.service";

export async function postImageMetaDataHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = postImageSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await postImageMetaData(
    req.params.postId,
    String(req.user.id),
    result.data,
  );
  return res.status(201).json(response);
}

export async function deletePostImageHandler(
  req: Request<{ postId: string; imageId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  await deletePostImage(
    req.params.postId,
    req.params.imageId,
    String(req.user.id),
  );
  return res.status(204).send();
}
