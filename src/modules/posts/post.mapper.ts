import { Post, PostImage, User } from "../../generated/prisma/client";

type FeedAuthor = Pick<User, "id" | "name" | "role">;

type FeedImage = Pick<
  PostImage,
  "id" | "url" | "width" | "height" | "sizeBytes" | "mimeType"
>;

type FeedPost = Post & {
  author: FeedAuthor;
  images: FeedImage[];
};

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
  post: FeedPost,
  stats: { likesCount: number; commentsCount: number },
  viewer: { liked: boolean; saved: boolean },
) => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    author: post.author,
    images: post.images,
    stats,
    viewer,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
