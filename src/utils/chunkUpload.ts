// utils/chunkUploader.ts

export interface ChunkUploadParams {
  file: File;
  fileId: string;
  sessionId: string;
  uploadPath: string;
  totalSizeLimitPerChunk?: number; // default ~700kb
  onProgress?: (progress: number) => void;
}

export async function uploadFileInChunks({
  file,
  fileId,
  uploadPath,
  sessionId,
  totalSizeLimitPerChunk = 700 * 1024,
  onProgress,
}: ChunkUploadParams): Promise<void> {
  const base64 = await fileToBase64(file);
  const totalChunks = Math.ceil(base64.length / totalSizeLimitPerChunk);

  for (let i = 0; i < totalChunks; i++) {
    const chunk = base64.slice(
      i * totalSizeLimitPerChunk,
      (i + 1) * totalSizeLimitPerChunk
    );

    await fetch("/api/upload/chunk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId,
        sessionId,
        uploadPath,
        chunkIndex: i,
        totalChunks,
        isLastChunk: i === totalChunks - 1,
        data: chunk,
      }),
    });

    if (onProgress) {
      onProgress((i + 1) / totalChunks);
    }
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]); // remove data prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
