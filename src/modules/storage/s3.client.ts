import { S3Client } from "@aws-sdk/client-s3";
import { storageConfig } from "../../config/storage.config";

export const s3Client = new S3Client({
  region: storageConfig.awsRegion,
  credentials: {
    accessKeyId: storageConfig.awsAccessKeyId,
    secretAccessKey: storageConfig.awsSecretAccessKey,
  },
});
