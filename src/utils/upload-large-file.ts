// utils/upload-large-file.ts
import { compressFileGzip, blobToBase64 } from "./file-to-base64";

const COMPRESSED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "video/mp4",
];
export async function prepareSmartUpload(file: File): Promise<{
  fileName: string;
  contentType: string;
  fileData: string;
}> {
  let blobToEncode: Blob;
  let fileName = file.name;
  let contentType = file.type;

  if (COMPRESSED_TYPES.includes(file.type)) {
    // Không nén thêm, giữ nguyên
    blobToEncode = file;
  } else {
    // Nén bằng gzip
    const gzip = await compressFileGzip(file);
    blobToEncode = gzip;
    fileName += ".gz";
    contentType = "application/gzip";
  }

  const base64 = await blobToBase64(blobToEncode);
  return {
    fileName,
    contentType,
    fileData: base64,
  };
}
