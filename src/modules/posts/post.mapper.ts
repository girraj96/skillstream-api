import { Post, User } from "../../generated/prisma/client";

export const toPostResponse = (post: Post) => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

export const toFeedPostResponse = (
  post: Post & { author: User },
  stats: { likesCount: number; commentsCount: number },
  viewer: { liked: boolean; saved: boolean },
) => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    author: {
      id: post.author.id,
      name: post.author.name,
      role: post.author.role,
    },
    stats,
    viewer,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
