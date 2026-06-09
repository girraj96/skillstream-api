import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(50),
  role: z.enum(["developer", "student", "admin"]).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
