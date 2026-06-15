import { z } from "zod";

export const commentSchema = z.object({
  body: z.string().min(10).max(5000),
});

export const cursorCommentsPaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  cursor: z.coerce.number().int().positive().optional(),
});
