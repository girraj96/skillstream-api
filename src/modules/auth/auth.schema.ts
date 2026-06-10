import z from "zod";

const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(100),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(100),
  newPassword: z.string().min(8).max(100),
});

export { loginUserSchema, changePasswordSchema };
