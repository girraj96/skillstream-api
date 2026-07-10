import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import { getPostStatsByPostIds } from "../../utils/helper";
import { toFeedPostResponse, toPostResponse } from "./post.mapper";
import {
  CursorPostSearchPaginationMap,
  CursorPostsPaginationMap,
  Post,
  UpdatePost,
} from "./post.types";

export async function createPost(input: Post, authorId: string) {
  const createdPost = await prisma.post.create({
    data: {
      title: input.title,
      content: input.content,
      authorId: Number(authorId),
    },
  });

  return toPostResponse(createdPost);
}

export async function getMyPosts(authorId: string) {
  const where: Prisma.PostWhereInput = {
    deletedAt: null,
    authorId: Number(authorId),
  };

  const posts = await prisma.post.findMany({
    where,

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: posts.map(toPostResponse),
  };
}

export async function updatePost(
  postInput: UpdatePost,
  postId: string,
  authorId: string,
) {
  const pId = Number(postId);
  const aId = Number(authorId);

  if (isNaN(pId)) throw new AppError(400, "Invalid post id");

  try {
    const foundPost = await prisma.post.findFirst({
      where: { id: pId, deletedAt: null },
    });

    if (!foundPost || foundPost?.authorId !== aId)
      throw new AppError(404, "Post not found");

    const updatedPost = await prisma.post.update({
      where: { id: pId },
      data: postInput,
    });
    return toPostResponse(updatedPost);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError(404, "Post not found");
    }

    throw error;
  }
}

export async function deletePost(postId: string, authorId: string) {
  const pId = Number(postId);
  const aId = Number(authorId);

  if (isNaN(pId)) throw new AppError(400, "Invalid post id");

  const existingPost = await prisma.post.findFirst({
    where: { id: pId, deletedAt: null },
  });

  if (!existingPost || existingPost.authorId !== aId)
    throw new AppError(404, "Post not found");

  return await prisma.post.update({
    where: { id: pId },
    data: { deletedAt: new Date() },
  });
}

export async function getFeed(
  input: CursorPostsPaginationMap,
  uId: number | undefined,
) {
  const where: Prisma.PostWhereInput = {
    deletedAt: null,
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const feedPosts = await prisma.post.findMany({
    where,
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
    include: {
      author: true,
    },
  });

  const hasNextPage = feedPosts.length > input.limit;

  const pagePosts = hasNextPage ? feedPosts.slice(0, input.limit) : feedPosts;

  const postIds = pagePosts.map((post) => post.id);

  const nextCursor = hasNextPage ? pagePosts[pagePosts.length - 1].id : null;
  const { likedPostIds, savedPostIds } = await getPostStatsByPostIds(
    postIds,
    uId,
  );
  return {
    data: pagePosts.map((post) =>
      toFeedPostResponse(
        post,
        {
          likesCount: post.likesCount ?? 0,
          commentsCount: post.commentsCount ?? 0,
        },
        { liked: likedPostIds.has(post.id), saved: savedPostIds.has(post.id) },
      ),
    ),

    meta: {
      limit: input.limit,
      nextCursor: nextCursor,
    },
  };
}

export async function searchPosts(
  input: CursorPostSearchPaginationMap,
  uId: number | undefined,
) {
  const where: Prisma.PostWhereInput = {
    deletedAt: null,
    OR: [{ title: { contains: input.q } }, { content: { contains: input.q } }],
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const feedPosts = await prisma.post.findMany({
    where,
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
    include: {
      author: true,
    },
  });

  const hasNextPage = feedPosts.length > input.limit;

  const pagePosts = hasNextPage ? feedPosts.slice(0, input.limit) : feedPosts;

  const postIds = pagePosts.map((post) => post.id);

  const nextCursor = hasNextPage ? pagePosts[pagePosts.length - 1].id : null;

  const { likedPostIds, savedPostIds } = await getPostStatsByPostIds(
    postIds,
    uId,
  );
  return {
    data: pagePosts.map((post) =>
      toFeedPostResponse(
        post,
        {
          likesCount: post.likesCount ?? 0,
          commentsCount: post.commentsCount ?? 0,
        },
        { liked: likedPostIds.has(post.id), saved: savedPostIds.has(post.id) },
      ),
    ),

    meta: {
      limit: input.limit,
      nextCursor: nextCursor,
    },
  };
}
