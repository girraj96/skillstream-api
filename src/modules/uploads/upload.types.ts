export interface ImageUploadUrl {
  fileName: string;
  sizeBytes: number;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
}
