import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { CommentWhereInput } from "../../generated/prisma/models";

import { toCommentResponse } from "./comment.mapper";
import { Comment, CursorCommentsPaginationMap } from "./comment.types";

export async function addComment(input: Comment, pId: string, aId: string) {
  const postId = Number(pId);
  const authorId = Number(aId);

  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const comment = await prisma.comment.create({
    data: {
      body: input.body,
      authorId,
      postId,
    },
    include: {
      author: true,
    },
  });

  return toCommentResponse(comment);
}

export async function getPostComments(
  input: CursorCommentsPaginationMap,
  pId: string,
) {
  const postId = Number(pId);
  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const where: CommentWhereInput = {
    deletedAt: null,
    postId,
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const comments = await prisma.comment.findMany({
    where,
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
    include: {
      author: true,
    },
  });

  const hasNextPage = comments.length > input.limit;

  const pageComments = hasNextPage ? comments.slice(0, input.limit) : comments;
  const nextCursor = hasNextPage
    ? pageComments[pageComments.length - 1].id
    : null;

  return {
    data: pageComments.map(toCommentResponse),
    meta: {
      ...input,
      nextCursor: nextCursor,
    },
  };
}
