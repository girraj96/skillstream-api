import { z } from "zod";
import {
  completeUploadSchema,
  createVideoCommentSchema,
  createVideoUploadUrlSchema,
  cursorTrendingVideosPaginationSchema,
  cursorVideoCommentPaginationSchema,
  cursorVideoFeedPaginationSchema,
  cursorVideoSearchSchema,
} from "./video.schema";

export type VideoUploadUrl = z.infer<typeof createVideoUploadUrlSchema>;

export type CompleteUploadInput = z.infer<typeof completeUploadSchema>;

export type CursorVideoFeedPagination = z.infer<
  typeof cursorVideoFeedPaginationSchema
>;

export type CursorVideoSearchPaginationMap = z.infer<
  typeof cursorVideoSearchSchema
>;

export type CursorVideoTrendingPagination = z.infer<
  typeof cursorTrendingVideosPaginationSchema
>;

export type CreateVideoComment = z.infer<typeof createVideoCommentSchema>;

export type CursorVideoCommentPagination = z.infer<
  typeof cursorVideoCommentPaginationSchema
>;
