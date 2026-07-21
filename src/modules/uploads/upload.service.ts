import { CompleteUploadInput, ImageUploadUrl } from "./upload.types";
import {
  assertImageObjectBelongsToUser,
  createImageUploadTarget,
} from "../storage/storage.service";
import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { storageConfig } from "../../config/storage.config";

export async function createImageUploadUrl(uId: string, input: ImageUploadUrl) {
  const userId = Number(uId);
  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }
  const uploadTarget = createImageUploadTarget(userId, input.fileName);
  const expiresAt = new Date(Date.now() + storageConfig.uploadExpiresMs);

  await prisma.upload.create({
    data: {
      userId,
      objectKey: uploadTarget.objectKey,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      status: "pending",
      expiresAt,
    },
  });

  return {
    data: {
      ...uploadTarget,
      expiresAt,
    },
  };
}

export async function completeUpload(uId: string, input: CompleteUploadInput) {
  const userId = Number(uId);

  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  assertImageObjectBelongsToUser(input.objectKey, userId);

  const upload = await prisma.upload.findFirst({
    where: {
      userId,
      objectKey: input.objectKey,
    },
  });

  if (!upload) {
    throw new AppError(404, "Upload not found");
  }

  if (upload.status === "expired") {
    throw new AppError(410, "Upload expired");
  }

  if (
    upload.status === "pending" &&
    upload.expiresAt &&
    upload.expiresAt < new Date()
  ) {
    await prisma.upload.update({
      where: { objectKey: input.objectKey },
      data: { status: "expired" },
    });

    throw new AppError(410, "Upload expired");
  }
  if (upload.status === "attached") {
    throw new AppError(409, "Upload is already attached");
  }

  if (upload.status === "uploaded") {
    return {
      data: {
        objectKey: upload.objectKey,
        status: upload.status,
      },
    };
  }

  const updatedUpload = await prisma.upload.update({
    where: {
      objectKey: input.objectKey,
    },
    data: {
      status: "uploaded",
    },
    select: {
      objectKey: true,
      status: true,
      updatedAt: true,
    },
  });

  return {
    data: updatedUpload,
  };
}
