import { User, UserFollow } from "../../generated/prisma/client";

export const toFollowerResponse = (follow: UserFollow & { follower: User }) => {
  return {
    id: follow.id,
    user: {
      id: follow.follower.id,
      name: follow.follower.name,
      role: follow.follower.role,
    },
    createdAt: follow.createdAt,
  };
};

export const toFollowingResponse = (
  follow: UserFollow & { following: User },
) => {
  return {
    id: follow.id,
    user: {
      id: follow.following.id,
      name: follow.following.name,
      role: follow.following.role,
    },
    createdAt: follow.createdAt,
  };
};
