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

export const toProfileResponse = (
  user: User,
  stats: { followersCount: number; followingCount: number },
  viewer: { isFollowing: boolean; isSelf: boolean },
) => {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    stats,
    viewer,
  };
};
