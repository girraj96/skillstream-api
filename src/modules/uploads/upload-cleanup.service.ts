import { prisma } from "../../db/prisma";

export async function expireOldPendingUploads() {
  const now = new Date();

  const result = await prisma.upload.updateMany({
    where: {
      status: "pending",
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: "expired",
    },
  });

  return {
    data: {
      expiredCount: result.count,
    },
  };
}
