import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { PostImage } from "./post-image.types";

export async function postImageMetaData(
  pId: string,
  uId: string,
  imgMetaData: PostImage,
) {
  const postId = Number(pId);
  const userId = Number(uId);

  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null, authorId: userId },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const expectedPrefix = `uploads/users/${userId}/`;

  if (!imgMetaData.objectKey.startsWith(expectedPrefix)) {
    throw new AppError(403, "You cannot attach this image");
  }

  const publicUrl = `https://cdn.fake.local/${imgMetaData.objectKey}`;

  const result = await prisma.postImage.create({
    data: {
      postId: postId,
      url: publicUrl,
      height: imgMetaData.height,
      width: imgMetaData.width,
      mimeType: imgMetaData.mimeType,
      sizeBytes: imgMetaData.sizeBytes,
      objectKey: imgMetaData.objectKey,
    },
  });

  return { data: result };
}

export async function deletePostImage(pId: string, imgId: string, uId: string) {
  const postId = Number(pId);
  const imageId = Number(imgId);
  const userId = Number(uId);

  if (Number.isNaN(postId) || Number.isNaN(imageId)) {
    throw new AppError(400, "Invalid post or image id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null, authorId: userId },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  const postImgFound = await prisma.postImage.findFirst({
    where: { id: imageId, postId: postId },
  });

  if (!postImgFound) {
    throw new AppError(404, "Post image not found");
  }

  await prisma.postImage.delete({
    where: { id: imageId },
  });
  return { data: "Success" };
}
