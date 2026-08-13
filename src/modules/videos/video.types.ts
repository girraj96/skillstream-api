import { z } from "zod";
import {
  completeUploadSchema,
  createVideoUploadUrlSchema,
  cursorTrendingVideosPaginationSchema,
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
