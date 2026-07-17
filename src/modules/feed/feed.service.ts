import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import { getPostStatsByPostIds } from "../../utils/helper";
import { CursorPaginationMap } from "../../utils/types";

export async function getFollowingFeed(
  input: CursorPaginationMap,
  uId: string,
) {
  const userId = Number(uId);

  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  const follows = await prisma.userFollow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = follows.map((follow) => follow.followingId);

  const where: Prisma.PostWhereInput = {
    deletedAt: null,
    authorId: { in: followingIds },
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const posts = await prisma.post.findMany({
    where,
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      images: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          url: true,
          width: true,
          height: true,
          sizeBytes: true,
          mimeType: true,
        },
      },
    },
  });

  const hasNextPage = posts.length > input.limit;

  const pagePosts = hasNextPage ? posts.slice(0, input.limit) : posts;
  const postIds = pagePosts.map((post) => post.id);

  const nextCursor = hasNextPage ? pagePosts[pagePosts.length - 1].id : null;

  const { likedPostIds, savedPostIds } = await getPostStatsByPostIds(
    postIds,
    userId,
  );

  return {
    data: pagePosts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,

      stats: {
        likesCount: post.likesCount ?? 0,
        commentsCount: post.commentsCount ?? 0,
      },
      viewer: {
        liked: likedPostIds.has(post.id),
        saved: savedPostIds.has(post.id),
      },
      images: post.images,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })),
    meta: {
      ...input,
      nextCursor: nextCursor,
    },
  };
}
