import "dotenv/config";
import { z } from "zod";

const storageEnvSchema = z.object({
  UPLOAD_URL_BASE: z.url().default("https://fake-upload.local"),
  PUBLIC_CDN_BASE_URL: z.url(),
  UPLOAD_EXPIRES_MINUTES: z.coerce.number().int().positive().default(10),

  AWS_REGION: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
});

const storageEnv = storageEnvSchema.parse(process.env);

export const storageConfig = {
  uploadUrlBase: storageEnv.UPLOAD_URL_BASE,
  publicCdnBaseUrl: storageEnv.PUBLIC_CDN_BASE_URL,
  uploadExpiresMinutes: storageEnv.UPLOAD_EXPIRES_MINUTES,
  uploadExpiresMs: storageEnv.UPLOAD_EXPIRES_MINUTES * 60 * 1000,
  uploadExpiresSeconds: storageEnv.UPLOAD_EXPIRES_MINUTES * 60,
  awsRegion: storageEnv.AWS_REGION,
  s3Bucket: storageEnv.AWS_S3_BUCKET,
  awsAccessKeyId: storageEnv.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: storageEnv.AWS_SECRET_ACCESS_KEY,
};
