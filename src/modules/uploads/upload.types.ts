import { z } from "zod";
import {
  completeUploadSchema,
  createImageUploadUrlSchema,
} from "./upload.schema";

export type ImageUploadUrl = z.infer<typeof createImageUploadUrlSchema>;

export type CompleteUploadInput = z.infer<typeof completeUploadSchema>;
