import "dotenv/config";
import { z } from "zod";

const storageEnvSchema = z.object({
  UPLOAD_URL_BASE: z.url().default("https://fake-upload.local"),
  PUBLIC_CDN_BASE_URL: z.url().default("https://cdn.fake.local"),
  UPLOAD_EXPIRES_MINUTES: z.coerce.number().int().positive().default(10),
});

const storageEnv = storageEnvSchema.parse(process.env);

export const storageConfig = {
  uploadUrlBase: storageEnv.UPLOAD_URL_BASE,
  publicCdnBaseUrl: storageEnv.PUBLIC_CDN_BASE_URL,
  uploadExpiresMinutes: storageEnv.UPLOAD_EXPIRES_MINUTES,
  uploadExpiresMs: storageEnv.UPLOAD_EXPIRES_MINUTES * 60 * 1000,
};
