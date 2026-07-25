import { prisma } from "../../db/prisma";
import { deleteImageObject } from "../storage/storage.service";

type CleanupExpiredUploadsResult = {
  expiredCount: number;
  deletedFromS3Count: number;
  failedDeletes: string[];
};

export async function expireOldPendingUploads(options?: {
  dryRun?: boolean;
  limit?: number;
}): Promise<CleanupExpiredUploadsResult> {
  const dryRun = options?.dryRun ?? false;
  const rawLimit = options?.limit ?? 100;
  const limit = Math.min(Math.max(rawLimit, 1), 500);

  const now = new Date();

  const expiredUploads = await prisma.upload.findMany({
    where: {
      status: "pending",

      expiresAt: {
        lt: now,
      },
    },
    take: limit,
    select: {
      id: true,
      objectKey: true,
    },
  });

  if (dryRun) {
    return {
      expiredCount: expiredUploads.length,
      deletedFromS3Count: 0,
      failedDeletes: [],
    };
  }

  let deletedFromS3Count = 0;
  const failedDeletes: string[] = [];

  for (const upload of expiredUploads) {
    try {
      await deleteImageObject(upload.objectKey);
      deletedFromS3Count += 1;
    } catch {
      failedDeletes.push(upload.objectKey);
    }
  }

  if (expiredUploads.length > 0) {
    await prisma.upload.updateMany({
      where: {
        id: {
          in: expiredUploads.map((upload) => upload.id),
        },
      },
      data: {
        status: "expired",
      },
    });
  }

  return {
    expiredCount: expiredUploads.length,
    deletedFromS3Count,
    failedDeletes,
  };
}
