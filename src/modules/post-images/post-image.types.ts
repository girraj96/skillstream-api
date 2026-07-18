export interface PostImage {
  objectKey: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  mimeType?: "image/jpeg" | "image/png" | "image/webp";
}
