import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";

export async function likePost(pId: string, aId: string) {
  const postId = Number(pId);
  const userId = Number(aId);

  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const likeFound = await prisma.postLike.findFirst({
    where: {
      postId,
      userId,
    },
  });

  if (likeFound) return { data: likeFound };

  const newLike = await prisma.postLike.create({
    data: {
      userId,
      postId,
    },
  });

  return { data: newLike };
}

export async function deleteLike(pId: string, aId: string) {
  const postId = Number(pId);
  const userId = Number(aId);

  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const likeFound = await prisma.postLike.findFirst({
    where: {
      postId,
      userId,
    },
  });

  if (likeFound) {
    await prisma.postLike.delete({
      where: {
        id: likeFound.id,
      },
    });
  }
  return { data: "Success" };
}

export async function getPostLikesCount(pId: string) {
  const postId = Number(pId);

  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const likeCount = await prisma.postLike.count({
    where: {
      postId,
    },
  });

  return {
    data: {
      likeCount,
    },
  };
}
