import { buildPublicVideoUrl } from "../storage/storage.service";
import type { VideoForResponse } from "./video.select";

export function toVideoResponse(video: VideoForResponse) {
  const originalRendition = video.renditions.find(
    (rendition) => rendition.quality === "original",
  );

  const playback =
    video.status === "ready" && originalRendition
      ? {
          quality: originalRendition.quality,
          url: buildPublicVideoUrl(originalRendition.objectKey),
        }
      : null;

  return {
    id: video.id,
    title: video.title,
    description: video.description,
    status: video.status,
    visibility: video.visibility,
    thumbnailUrl: video.thumbnailObjectKey
      ? buildPublicVideoUrl(video.thumbnailObjectKey)
      : null,
    viewsCount: video.viewsCount,
    likesCount: video.likesCount,
    author: {
      id: video.author.id,
      name: video.author.name,
    },
    playback,
    createdAt: video.createdAt,
  };
}
