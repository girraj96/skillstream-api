import { z } from "zod";

export const postImageSchema = z
  .object({
    objectKey: z.string().min(1),
    width: z.coerce.number().int().positive().optional(),
    height: z.coerce.number().int().positive().optional(),
    sizeBytes: z.coerce.number().int().positive().optional(),
    mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]).optional(),
  })
  .strict();
