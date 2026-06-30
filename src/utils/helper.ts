import { prisma } from "../db/prisma";

export async function getPostStatsByPostIds(
  postIds: number[],
  userId?: number,
) {
  if (postIds.length === 0) {
    return {
      likesCountByPostId: new Map<number, number>(),
      commentsCountByPostId: new Map<number, number>(),
      likedPostIds: new Set<number>(),
      savedPostIds: new Set<number>(),
    };
  }

  const likeGroups = await prisma.postLike.groupBy({
    by: ["postId"],
    where: {
      postId: {
        in: postIds,
      },
    },
    _count: {
      _all: true,
    },
  });

  const commentGroups = await prisma.comment.groupBy({
    by: ["postId"],
    where: {
      postId: {
        in: postIds,
      },
      deletedAt: null,
    },
    _count: {
      _all: true,
    },
  });

  const likedPost = userId
    ? await prisma.postLike.findMany({
        where: { userId, postId: { in: postIds } },
      })
    : [];

  const savedPosts = userId
    ? await prisma.savedPost.findMany({
        where: { userId, postId: { in: postIds } },
      })
    : [];

  const likesCountByPostId = new Map(
    likeGroups.map((item) => [item.postId, item._count._all]),
  );

  const commentsCountByPostId = new Map(
    commentGroups.map((item) => [item.postId, item._count._all]),
  );

  const likedPostIds = new Set(likedPost.map((like) => like.postId));
  const savedPostIds = new Set(savedPosts.map((save) => save.postId));

  return {
    likesCountByPostId,
    commentsCountByPostId,
    likedPostIds,
    savedPostIds,
  };
}
