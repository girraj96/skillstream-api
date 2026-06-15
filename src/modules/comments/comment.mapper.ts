import { Comment, User } from "../../generated/prisma/client";

export const toCommentResponse = (comment: Comment & { author: User }) => {
  return {
    id: comment.id,
    body: comment.body,
    authorId: comment.authorId,
    postId: comment.postId,
    author: {
      id: comment.author.id,
      name: comment.author.name,
      role: comment.author.role,
    },
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};
