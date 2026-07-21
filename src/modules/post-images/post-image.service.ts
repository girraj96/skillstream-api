import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import {
  assertImageObjectBelongsToUser,
  buildPublicImageUrl,
  deleteImageObject,
} from "../storage/storage.service";
import { PostImage } from "./post-image.types";

export async function postImageMetaData(
  pId: string,
  uId: string,
  imgMetaData: PostImage,
) {
  const postId = Number(pId);
  const userId = Number(uId);
  const objectKey: string = imgMetaData.objectKey;

  if (Number.isNaN(postId)) {
    throw new AppError(400, "Invalid post id");
  }

  const foundPost = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null, authorId: userId },
  });
  if (!foundPost) throw new AppError(404, "Post not found");

  assertImageObjectBelongsToUser(objectKey, userId);

  const result = await prisma.$transaction(async (tx) => {
    const upload = await tx.upload.findFirst({
      where: {
        userId,
        objectKey,
      },
    });

    if (!upload) {
      throw new AppError(404, "Upload not found");
    }

    if (upload.status === "expired") {
      throw new AppError(410, "Upload expired");
    }

    if (
      upload.status === "pending" &&
      upload.expiresAt &&
      upload.expiresAt < new Date()
    ) {
      await tx.upload.update({
        where: { objectKey },
        data: { status: "expired" },
      });

      throw new AppError(410, "Upload expired");
    }

    if (upload.status !== "uploaded") {
      throw new AppError(409, "Upload is not completed");
    }
    const postImage = await tx.postImage.create({
      data: {
        postId,
        url: buildPublicImageUrl(objectKey),
        height: imgMetaData.height,
        width: imgMetaData.width,
        mimeType: imgMetaData.mimeType,
        sizeBytes: imgMetaData.sizeBytes,
        objectKey,
      },
    });

    await tx.upload.update({
      where: {
        objectKey,
      },
      data: {
        status: "attached",
      },
    });

    return postImage;
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

  if (postImgFound.objectKey) {
    await deleteImageObject(postImgFound.objectKey);
  }
  await prisma.postImage.delete({
    where: { id: imageId },
  });
  return { data: "Success" };
}
