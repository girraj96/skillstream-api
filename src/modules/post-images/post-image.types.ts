export interface PostImage {
  url: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  mimeType?: "image/jpeg" | "image/png" | "image/webp";
}
