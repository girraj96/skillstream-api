import { prisma } from "../../db/prisma";
import { verifyStorageObjectExists } from "../storage/storage.service";

type ProcessVideosOptions = {
  dryRun?: boolean;
  limit?: number;
};

type ProcessVideosResult = {
  mode: "dry-run" | "apply";
  limit: number;
  processingVideosFound: number;
  processedVideos: number;
  failedVideos: number[];
};

function normalizeLimit(limit?: number) {
  const rawLimit = limit ?? 10;
  return Math.min(Math.max(rawLimit, 1), 100);
}

export async function processVideos(
  options?: ProcessVideosOptions,
): Promise<ProcessVideosResult> {
  const dryRun = options?.dryRun ?? false;
  const limit = normalizeLimit(options?.limit);

  const videos = await prisma.video.findMany({
    where: {
      status: "processing",
      deletedAt: null,
    },
    take: limit,
    select: {
      id: true,
      originalObjectKey: true,
    },
  });

  let processedVideos = 0;
  const failedVideos: number[] = [];

  for (const video of videos) {
    try {
      const s3Object = await verifyStorageObjectExists(video.originalObjectKey);

      if (dryRun) {
        continue;
      }

      await prisma.$transaction(async (tx) => {
        await tx.videoRendition.upsert({
          where: {
            videoId_quality: {
              videoId: video.id,
              quality: "original",
            },
          },
          update: {
            objectKey: video.originalObjectKey,
            sizeBytes: s3Object.sizeBytes,
          },
          create: {
            videoId: video.id,
            quality: "original",
            objectKey: video.originalObjectKey,
            sizeBytes: s3Object.sizeBytes,
          },
        });

        await tx.video.update({
          where: {
            id: video.id,
          },
          data: {
            status: "ready",
          },
        });
      });

      processedVideos += 1;
    } catch {
      failedVideos.push(video.id);
    }
  }

  return {
    mode: dryRun ? "dry-run" : "apply",
    limit,
    processingVideosFound: videos.length,
    processedVideos,
    failedVideos,
  };
}
