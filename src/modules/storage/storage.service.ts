import crypto from "node:crypto";
import AppError from "../../errors/app-error";
import { storageConfig } from "../../config/storage.config";

import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3.client";

type ImageUploadTarget = {
  uploadUrl: string;
  objectKey: string;
};

type DeleteImageObjectResult = {
  deleted: true;
  objectKey: string;
};

type VerifiedImageObject = {
  objectKey: string;
  mimeType?: string;
  sizeBytes?: number;
};

type ImageViewTarget = {
  url: string;
  expiresAt: Date;
};

export async function createImageUploadTarget(
  userId: number,
  fileName: string,
  mimeType: string,
): Promise<ImageUploadTarget> {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");

  const id = crypto.randomUUID();
  const objectKey = `uploads/users/${userId}/${id}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: storageConfig.s3Bucket,
    Key: objectKey,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: storageConfig.uploadExpiresSeconds,
  });

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
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: storageConfig.s3Bucket,
      Key: objectKey,
    }),
  );

  return {
    deleted: true,
    objectKey,
  };
}

export async function verifyImageObjectExists(
  objectKey: string,
): Promise<VerifiedImageObject> {
  try {
    const result = await s3Client.send(
      new HeadObjectCommand({
        Bucket: storageConfig.s3Bucket,
        Key: objectKey,
      }),
    );

    return {
      objectKey,
      mimeType: result.ContentType,
      sizeBytes: result.ContentLength,
    };
  } catch (error) {
    if (
      error instanceof S3ServiceException &&
      error.$metadata.httpStatusCode === 404
    ) {
      throw new AppError(409, "File has not been uploaded yet");
    }

    throw error;
  }
}

export async function createImageViewUrl(
  objectKey: string,
): Promise<ImageViewTarget> {
  const expiresInSeconds = 5 * 60; // 5 minutes
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  const command = new GetObjectCommand({
    Bucket: storageConfig.s3Bucket,
    Key: objectKey,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });

  return {
    url,
    expiresAt,
  };
}
