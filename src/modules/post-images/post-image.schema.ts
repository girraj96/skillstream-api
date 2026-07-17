import { z } from "zod";

export const postImageSchema = z.object({
  url: z.url(),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  sizeBytes: z.coerce.number().int().positive().optional(),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]).optional(),
});
