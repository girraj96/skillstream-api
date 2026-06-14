import { Post } from "../../generated/prisma/client";

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
