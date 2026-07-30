import { storageConfig } from "../../config/storage.config";
import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import {
  assertVideoObjectBelongsToUser,
  createVideoUploadTarget,
  verifyStorageObjectExists,
} from "../storage/storage.service";
import { toVideoResponse } from "./video.mapper";
import {
  findVideoForResponse,
  parseVideoId,
  videoResponseSelect,
} from "./video.select";
import {
  CompleteUploadInput,
  CursorVideoFeedPagination,
  VideoUploadUrl,
} from "./video.types";

export async function createVideoUploadUrl(uId: string, input: VideoUploadUrl) {
  const userId = Number(uId);
  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }
  const uploadTarget = await createVideoUploadTarget(
    userId,
    input.fileName,
    input.mimeType,
  );
  const expiresAt = new Date(Date.now() + storageConfig.uploadExpiresMs);

  const video = await prisma.video.create({
    data: {
      authorId: userId,
      title: input.title,
      description: input.description,
      originalObjectKey: uploadTarget.objectKey,
      visibility: "private",
      status: "pending",
    },
  });

  return {
    data: {
      video: {
        id: video.id,
        title: video.title,
        status: video.status,
      },
      upload: {
        ...uploadTarget,
        expiresAt,
      },
    },
  };
}

export async function completeVideoUpload(
  uId: string,

  vId: string,
  input: CompleteUploadInput,
) {
  const userId = Number(uId);
  const videoId = parseVideoId(vId);

  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  assertVideoObjectBelongsToUser(input.objectKey, userId);

  const videoFound = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!videoFound) {
    throw new AppError(404, "Video not found");
  }

  if (videoFound.authorId !== userId) {
    throw new AppError(403, "You cannot complete this video upload");
  }

  if (videoFound.status !== "pending") {
    throw new AppError(409, "Video upload is not pending");
  }

  if (videoFound.originalObjectKey !== input.objectKey) {
    throw new AppError(400, "Object key does not match this video");
  }

  await verifyStorageObjectExists(input.objectKey);

  const updatedUpload = await prisma.video.update({
    where: {
      id: videoId,
    },
    data: {
      status: "processing",
    },
    select: {
      id: true,
      originalObjectKey: true,
      status: true,
    },
  });

  return {
    data: updatedUpload,
  };
}

export async function getVideo(viewerUserId: number | undefined, vId: string) {
  const videoId = parseVideoId(vId);

  const video = await findVideoForResponse(videoId);

  if (!video || video.deletedAt) {
    throw new AppError(404, "Video not found");
  }

  if (video.visibility === "private" && video.authorId !== viewerUserId) {
    throw new AppError(403, "You're not authorized to see this video");
  }

  return {
    data: toVideoResponse(video),
  };
}

export async function getVideoFeed(input: CursorVideoFeedPagination) {
  const where: Prisma.VideoWhereInput = {
    deletedAt: null,
    status: "ready",
    visibility: "public",
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const feedVideos = await prisma.video.findMany({
    where,
    take: input.limit + 1,
    select: videoResponseSelect,
    orderBy: {
      id: "desc",
    },
  });

  const hasNextPage = feedVideos.length > input.limit;

  const pageVideos = feedVideos.slice(0, input.limit);

  const nextCursor = hasNextPage ? pageVideos[pageVideos.length - 1].id : null;

  return {
    data: pageVideos.map((video) => toVideoResponse(video)),
    nextCursor,
  };
}

export async function publishVideo(uId: string, vId: string) {
  const videoId = parseVideoId(vId);

  const userId = Number(uId);
  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  const video = await findVideoForResponse(videoId);

  if (!video || video.deletedAt) throw new AppError(404, "Video not found");

  if (video.authorId !== userId) {
    throw new AppError(403, "You cannot publish this video");
  }

  if (video.status !== "ready") {
    throw new AppError(409, "Only ready videos can be published");
  }

  const updatedVideo = await prisma.video.update({
    where: { id: videoId },
    data: { visibility: "public" },
    select: videoResponseSelect,
  });

  return {
    data: toVideoResponse(updatedVideo),
  };
}

export async function unPublishVideo(uId: string, vId: string) {
  const videoId = parseVideoId(vId);

  const userId = Number(uId);
  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  const video = await findVideoForResponse(videoId);

  if (!video || video.deletedAt) throw new AppError(404, "Video not found");

  if (video.authorId !== userId) {
    throw new AppError(403, "You cannot unpublish this video");
  }

  const updatedVideo = await prisma.video.update({
    where: { id: videoId },
    data: { visibility: "private" },
    select: videoResponseSelect,
  });

  return {
    data: toVideoResponse(updatedVideo),
  };
}
