import { z } from "zod";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const createImageUploadUrlSchema = z
  .object({
    fileName: z.string().min(1),
    mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
    sizeBytes: z.coerce.number().int().positive().max(MAX_IMAGE_SIZE_BYTES),
  })
  .strict();

export const completeUploadSchema = z
  .object({
    objectKey: z.string().min(1),
  })
  .strict();
