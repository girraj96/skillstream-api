import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { UserFollowWhereInput } from "../../generated/prisma/models";
import { toFollowerResponse, toFollowingResponse } from "./follow.mapper";
import { CursorFollowPaginationMap } from "./follow.types";

export async function createFollowing(followingUid: string, uId: string) {
  const followerId = Number(uId);
  const followingId = Number(followingUid);

  if (Number.isNaN(followerId) || Number.isNaN(followingId)) {
    throw new AppError(400, "Invalid user id");
  }

  if (followerId === followingId) {
    throw new AppError(400, "You cannot follow yourself");
  }

  const foundFollowerUser = await prisma.user.findFirst({
    where: { id: followerId, deletedAt: null },
  });

  if (!foundFollowerUser) throw new AppError(404, "User not found");

  const foundFollowingUser = await prisma.user.findFirst({
    where: { id: followingId, deletedAt: null },
  });

  if (!foundFollowingUser) {
    throw new AppError(404, "User not found");
  }

  const followerFound = await prisma.userFollow.findFirst({
    where: {
      followerId: followerId,
      followingId: followingId,
    },
  });

  if (followerFound) return { data: followerFound };

  const result = await prisma.$transaction(async (tx) => {
    const follow = await tx.userFollow.create({
      data: {
        followerId,
        followingId,
      },
    });

    await tx.notification.create({
      data: {
        userId: followingId, // person receiving notification
        actorId: followerId, // person who performed follow
        type: "follow",
      },
    });

    return follow;
  });

  return {
    data: result,
  };
}

export async function unfollowUser(followingUid: string, uId: string) {
  const followerId = Number(uId);
  const followingId = Number(followingUid);

  if (Number.isNaN(followerId) || Number.isNaN(followingId)) {
    throw new AppError(400, "Invalid user id");
  }

  if (followerId === followingId) {
    throw new AppError(400, "You cannot unfollow yourself");
  }

  const followerFound = await prisma.userFollow.findFirst({
    where: {
      followerId: followerId,
      followingId: followingId,
    },
  });

  if (followerFound) {
    await prisma.userFollow.delete({
      where: {
        id: followerFound.id,
      },
    });
  }
  return { data: "Success" };
}

export async function allFollowers(
  input: CursorFollowPaginationMap,
  uId: string,
) {
  const userId = Number(uId);

  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  const existingUser = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!existingUser) throw new AppError(404, "User not found");
  const where: UserFollowWhereInput = {
    followingId: userId,
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const follows = await prisma.userFollow.findMany({
    where,
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
    include: {
      follower: true,
    },
  });

  const hasNextPage = follows.length > input.limit;

  const pageFollows = hasNextPage ? follows.slice(0, input.limit) : follows;
  const nextCursor = hasNextPage
    ? pageFollows[pageFollows.length - 1].id
    : null;

  return {
    data: pageFollows.map(toFollowerResponse),
    meta: {
      ...input,
      nextCursor: nextCursor,
    },
  };
}

export async function allFollowings(
  input: CursorFollowPaginationMap,
  uId: string,
) {
  const userId = Number(uId);

  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  const existingUser = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!existingUser) throw new AppError(404, "User not found");

  const where: UserFollowWhereInput = {
    followerId: userId,
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const follows = await prisma.userFollow.findMany({
    where,
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
    include: {
      following: true,
    },
  });

  const hasNextPage = follows.length > input.limit;

  const pageFollows = hasNextPage ? follows.slice(0, input.limit) : follows;
  const nextCursor = hasNextPage
    ? pageFollows[pageFollows.length - 1].id
    : null;

  return {
    data: pageFollows.map(toFollowingResponse),
    meta: {
      ...input,
      nextCursor: nextCursor,
    },
  };
}
