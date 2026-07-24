import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import { getPostStatsByPostIds } from "../../utils/helper";
import { toFeedPostResponse } from "../posts/post.mapper";
import { CursorPostsPaginationMap } from "../posts/post.types";

export async function savePost(pId: string, aId: string) {
  const postId = Number(pId);
  const userId = Number(aId);

  if (isNaN(postId)) throw new AppError(400, "Invalid post id");

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });

  if (!foundPost) throw new AppError(404, "Post not found");

  const savedPostFound = await prisma.savedPost.findFirst({
    where: {
      postId,
      userId,
    },
  });

  if (savedPostFound) return { data: savedPostFound };

  const savedPost = await prisma.savedPost.create({
    data: {
      postId,
      userId,
    },
  });
  return { data: savedPost };
}

export async function deleteSavedPost(pId: string, aId: string) {
  const postId = Number(pId);
  const userId = Number(aId);

  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const savedPostFound = await prisma.savedPost.findFirst({
    where: {
      postId,
      userId,
    },
  });

  if (savedPostFound) {
    await prisma.savedPost.delete({
      where: {
        id: savedPostFound.id,
      },
    });
  }
  return { data: "Success" };
}

export async function getSavedPosts(
  input: CursorPostsPaginationMap,
  uId: string,
) {
  const userId = Number(uId);
  const where: Prisma.SavedPostWhereInput = {
    userId,
    post: {
      deletedAt: null,
    },
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const savedPosts = await prisma.savedPost.findMany({
    where,
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          images: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              objectKey: true,
              width: true,
              height: true,
              sizeBytes: true,
              mimeType: true,
            },
          },
        },
      },
    },
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
  });

  const hasNextPage = savedPosts.length > input.limit;

  const pageSavedPosts = hasNextPage
    ? savedPosts.slice(0, input.limit)
    : savedPosts;

  const postIds = pageSavedPosts.map((savedPost) => savedPost.postId);

  const nextCursor = hasNextPage
    ? pageSavedPosts[pageSavedPosts.length - 1].id
    : null;

  const { likedPostIds, savedPostIds } = await getPostStatsByPostIds(
    postIds,
    userId,
  );

  return {
    data: pageSavedPosts.map((savedPost) => {
      const post = savedPost.post;

      return toFeedPostResponse(
        post,
        {
          likesCount: post.likesCount ?? 0,
          commentsCount: post.commentsCount ?? 0,
        },
        { liked: likedPostIds.has(post.id), saved: savedPostIds.has(post.id) },
      );
    }),

    meta: {
      limit: input.limit,
      nextCursor: nextCursor,
    },
  };
}
