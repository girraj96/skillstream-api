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

export const toFeedPostResponse = (post: Post & { author: User }) => {
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
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
