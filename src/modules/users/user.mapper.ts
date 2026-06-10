import type { User } from "../../generated/prisma/client";

export const toUserResponse = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
