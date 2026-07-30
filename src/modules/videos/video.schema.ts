import { z } from "zod";

const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

export const createVideoUploadUrlSchema = z
  .object({
    title: z.string().min(1).max(100),
    description: z.string().min(10).max(5000),
    fileName: z.string().min(1),
    mimeType: z.enum(["video/mp4"]),
    sizeBytes: z.coerce.number().int().positive().max(MAX_VIDEO_SIZE_BYTES),
  })
  .strict();

export const completeUploadSchema = z
  .object({
    objectKey: z.string().min(1),
  })
  .strict();

export const viewVideoUrlSchema = z
  .object({
    objectKey: z.string().min(1),
  })
  .strict();

export const cursorVideoFeedPaginationSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(50).default(10),
    cursor: z.coerce.number().int().positive().optional(),
  })
  .strict();
