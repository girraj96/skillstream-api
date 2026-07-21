import crypto from "node:crypto";
import AppError from "../../errors/app-error";
import { storageConfig } from "../../config/storage.config";

type ImageUploadTarget = {
  uploadUrl: string;
  objectKey: string;
};

type DeleteImageObjectResult = {
  deleted: true;
  objectKey: string;
};

export function createImageUploadTarget(
  userId: number,
  fileName: string,
): ImageUploadTarget {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");

  const id = crypto.randomUUID();
  const objectKey = `uploads/users/${userId}/${id}-${safeFileName}`;
  const uploadUrl = `${storageConfig.uploadUrlBase}/${objectKey}?signature=fake`;

  return { uploadUrl, objectKey };
}

export function buildPublicImageUrl(objectKey: string): string {
  const publicUrl: string = `${storageConfig.publicCdnBaseUrl}/${objectKey}`;

  return publicUrl;
}

export function assertImageObjectBelongsToUser(
  objectKey: string,
  userId: number,
): void {
  const expectedPrefix = `uploads/users/${userId}/`;

  if (!objectKey.startsWith(expectedPrefix)) {
    throw new AppError(403, "You cannot attach this image");
  }
}

export async function deleteImageObject(
  objectKey: string,
): Promise<DeleteImageObjectResult> {
  return {
    deleted: true,
    objectKey,
  };
}
