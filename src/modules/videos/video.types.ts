import { z } from "zod";
import {
  completeUploadSchema,
  createVideoUploadUrlSchema,
  cursorVideoFeedPaginationSchema,
} from "./video.schema";

export type VideoUploadUrl = z.infer<typeof createVideoUploadUrlSchema>;

export type CompleteUploadInput = z.infer<typeof completeUploadSchema>;

export type CursorVideoFeedPagination = z.infer<
  typeof cursorVideoFeedPaginationSchema
>;
