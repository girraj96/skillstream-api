import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(50),
  role: z.enum(["developer", "student", "admin"]).default("developer"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z
    .enum(["id", "email", "name", "createdAt", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  role: z.enum(["developer", "student", "admin"]).optional(),
  q: z.string().min(2).max(50).optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(50).optional(),
    role: z.enum(["developer", "student", "admin"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
