import { z } from "zod";

export const postImageSchema = z
  .object({
    objectKey: z.string().min(1),
  })
  .strict();
