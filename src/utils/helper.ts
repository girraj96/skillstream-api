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

  const likedPostIds = new Set(likedPost.map((like) => like.postId));
  const savedPostIds = new Set(savedPosts.map((save) => save.postId));

  return {
    likedPostIds,
    savedPostIds,
  };
}

export async function getPostByAuthorIds(authorIds: number[]) {
  if (authorIds.length === 0) {
    return {
      posts: new Set<number>(),
    };
  }

  const posts = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    orderBy: {
      id: "desc",
    },
    include: {
      author: true,
    },
  });

  return {
    posts,
  };
}

export async function getVideoViewerStateByVideoIds(
  videoIds: number[],
  userId?: number,
) {
  if (videoIds.length === 0) {
    return {
      likedVideoIds: new Set<number>(),
      viewedVideoIds: new Set<number>(),
    };
  }

  const likedVideos = userId
    ? await prisma.videoLike.findMany({
        where: { userId, videoId: { in: videoIds } },
      })
    : [];

  const viewedVideo = userId
    ? await prisma.videoView.findMany({
        where: { userId, videoId: { in: videoIds } },
      })
    : [];

  const likedVideoIds = new Set(likedVideos.map((like) => like.videoId));
  const viewedVideoIds = new Set(viewedVideo.map((view) => view.videoId));

  return {
    likedVideoIds,
    viewedVideoIds,
  };
}
