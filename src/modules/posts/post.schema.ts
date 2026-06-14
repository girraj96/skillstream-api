import { z } from "zod";

export const createPostSchema = z
  .object({
    title: z.string().min(3).max(100),
    content: z.string().min(10).max(5000),
  })
  .strict();

export const updatePostSchema = z
  .object({
    title: z.string().min(3).max(100).optional(),
    content: z.string().min(10).max(5000).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const cursorPostsPaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  cursor: z.coerce.number().int().positive().optional(),
});
