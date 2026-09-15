import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import z from "zod";
import {
  completeVideoUpload,
  createVideoComment,
  createVideoUploadUrl,
  deleteVideoComment,
  deleteVideoLike,
  getTrendingVideos,
  getVideo,
  getVideoComments,
  getVideoFeed,
  likeVideo,
  publishVideo,
  searchVideos,
  unPublishVideo,
  viewVideo,
} from "./video.service";
import {
  completeUploadSchema,
  createVideoCommentSchema,
  createVideoUploadUrlSchema,
  cursorTrendingVideosPaginationSchema,
  cursorVideoCommentPaginationSchema,
  cursorVideoFeedPaginationSchema,
  cursorVideoSearchSchema,
} from "./video.schema";

export async function createVideoUploadHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = createVideoUploadUrlSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await createVideoUploadUrl(String(req.user.id), result.data);
  return res.status(201).json(response);
}

export async function completeVideoUploadHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = completeUploadSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await completeVideoUpload(
    String(req.user.id),
    req.params.videoId,
    result.data,
  );
  return res.status(200).json(response);
}

export async function getVideoHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  const response = await getVideo(req.user?.id, req.params.videoId);
  return res.status(200).json(response);
}

export async function getVideoFeedHandler(req: Request, res: Response) {
  const result = cursorVideoFeedPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getVideoFeed(result.data, req.user?.id);
  return res.status(200).json(response);
}

export async function publishVideoHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await publishVideo(String(req.user.id), req.params.videoId);
  return res.status(200).json(response);
}

export async function unPublishVideoHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await unPublishVideo(
    String(req.user.id),
    req.params.videoId,
  );
  return res.status(200).json(response);
}

export async function searchVideosHandler(req: Request, res: Response) {
  const result = cursorVideoSearchSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await searchVideos(result.data, req.user?.id);
  return res.status(200).json(response);
}

export async function viewVideoHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const response = await viewVideo(String(req.user.id), req.params.videoId);
  return res.status(200).json(response);
}

export async function getTrendingVideosHandler(req: Request, res: Response) {
  const result = cursorTrendingVideosPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getTrendingVideos(result.data, req.user?.id);
  return res.status(200).json(response);
}

export async function likeVideoHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const response = await likeVideo(String(req.user.id), req.params.videoId);
  return res.status(200).json(response);
}

export async function deleteVideoLikeHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const response = await deleteVideoLike(
    String(req.user.id),
    req.params.videoId,
  );
  return res.status(200).json(response);
}

export async function createVideoCommentHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = createVideoCommentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await createVideoComment(
    String(req.user.id),
    req.params.videoId,
    result.data,
  );
  return res.status(201).json(response);
}

export async function getVideoCommentsHandler(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  const result = cursorVideoCommentPaginationSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }
  const response = await getVideoComments(
    req.user?.id,
    req.params.videoId,
    result.data,
  );
  return res.status(200).json(response);
}

export async function deleteVideoCommentHandler(
  req: Request<{ videoId: string; commentId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const response = await deleteVideoComment(
    String(req.user.id),
    req.params.videoId,
    req.params.commentId,
  );
  return res.status(200).json(response);
}
