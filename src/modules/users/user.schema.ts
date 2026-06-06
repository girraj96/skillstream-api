import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(50),
  role: z.enum(["developer", "student", "admin"]).optional(),
});
