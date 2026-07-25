import { CompleteUploadInput, ImageUploadUrl } from "./upload.types";
import {
  assertImageObjectBelongsToUser,
  createImageUploadTarget,
  createImageViewUrl,
  deleteImageObject,
  verifyImageObjectExists,
} from "../storage/storage.service";
import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { storageConfig } from "../../config/storage.config";
import { expireOldPendingUploads } from "./upload-cleanup.service";

export async function createImageUploadUrl(uId: string, input: ImageUploadUrl) {
  const userId = Number(uId);
  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }
  const uploadTarget = await createImageUploadTarget(
    userId,
    input.fileName,
    input.mimeType,
  );
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

  const s3Object = await verifyImageObjectExists(input.objectKey);

  if (s3Object.mimeType !== upload.mimeType) {
    throw new AppError(400, "Uploaded file type does not match request");
  }

  if (s3Object.sizeBytes !== upload.sizeBytes) {
    throw new AppError(400, "Uploaded file size does not match request");
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

export async function viewImageUrl(uId: string, input: CompleteUploadInput) {
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

  if (upload.status === "pending") {
    throw new AppError(409, "Upload is not completed");
  }

  if (upload.status !== "uploaded" && upload.status !== "attached") {
    throw new AppError(409, "Upload is not viewable");
  }

  const tempUrlInfo = await createImageViewUrl(input.objectKey);

  return {
    data: tempUrlInfo,
  };
}

export async function cleanupExpiredUploads(uId: string) {
  const userId = Number(uId);

  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  return {
    data: await expireOldPendingUploads(),
  };
}
