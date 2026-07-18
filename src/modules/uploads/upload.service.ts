import crypto from "node:crypto";
import { ImageUploadUrl } from "./upload.types";

export async function createImageUploadUrl(uId: string, input: ImageUploadUrl) {
  const userId = Number(uId);

  const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");

  const id = crypto.randomUUID();
  const objectKey = `uploads/users/${userId}/${id}-${safeFileName}`;
  const uploadUrl = `https://fake-upload.local/${objectKey}?signature=fake`;

  return {
    data: {
      uploadUrl,

      objectKey,
    },
  };
}
