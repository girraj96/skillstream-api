import AppError from "../../errors/app-error";
import { prisma } from "../../db/prisma";
import { Prisma } from "../../generated/prisma/client";

export const videoResponseSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  visibility: true,
  durationSeconds: true,
  thumbnailObjectKey: true,
  createdAt: true,
  deletedAt: true,
  authorId: true,
  viewsCount: true,
  likesCount: true,
  author: {
    select: {
      id: true,
      name: true,
    },
  },
  renditions: {
    select: {
      quality: true,
      objectKey: true,
      width: true,
      height: true,
      sizeBytes: true,
    },
  },
} satisfies Prisma.VideoSelect;

export type VideoForResponse = Prisma.VideoGetPayload<{
  select: typeof videoResponseSelect;
}>;

export function parseVideoId(videoIdRaw: string): number {
  const videoId = Number(videoIdRaw);

  if (Number.isNaN(videoId)) {
    throw new AppError(400, "Invalid video id");
  }

  return videoId;
}

export async function findVideoForResponse(
  videoId: number,
): Promise<VideoForResponse | null> {
  return prisma.video.findUnique({
    where: { id: videoId },
    select: videoResponseSelect,
  });
}

export async function findReadyVideoForResponse(
  videoId: number,
): Promise<VideoForResponse | null> {
  return prisma.video.findUnique({
    where: { id: videoId, status: "ready" },
    select: videoResponseSelect,
  });
}
