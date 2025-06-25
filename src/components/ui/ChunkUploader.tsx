"use client";

import { useState } from "react";
import { uploadFileInChunks } from "~/utils/chunkUpload";
import { v4 as uuidv4 } from "uuid";

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "idle" | "uploading" | "done" | "error";
}

export default function ChunkUploader() {
  const [filesProgress, setFilesProgress] = useState<UploadProgress[]>([]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const sessionId = "demo-session-xyz";
    const uploadPath = "/v1/custom-upload-path"; // dynamic path

    const progressState: UploadProgress[] = files.map((f) => ({
      fileName: f.name,
      progress: 0,
      status: "idle",
    }));

    setFilesProgress(progressState);

    files.forEach(async (file, idx) => {
      const fileId = uuidv4();

      setFilesProgress((prev) =>
        prev.map((p, i) => (i === idx ? { ...p, status: "uploading" } : p))
      );

      try {
        await uploadFileInChunks({
          file,
          fileId,
          sessionId,
          uploadPath,
          onProgress: (progress: number) =>
            setFilesProgress((prev) =>
              prev.map((p, i) =>
                i === idx ? { ...p, progress: Math.round(progress * 100) } : p
              )
            ),
        });

        setFilesProgress((prev) =>
          prev.map((p, i) => (i === idx ? { ...p, status: "done" } : p))
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setFilesProgress((prev) =>
          prev.map((p, i) => (i === idx ? { ...p, status: "error" } : p))
        );
      }
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-xl">
      <input type="file" multiple onChange={handleUpload} />
      <ul className="mt-4 space-y-3">
        {filesProgress.map((file, idx) => (
          <li key={idx} className="text-sm">
            <div className="font-medium">{file.fileName}</div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
              <div
                className={`h-2 rounded-full ${
                  file.status === "error"
                    ? "bg-red-500"
                    : file.status === "done"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${file.progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {file.status === "done"
                ? "Hoàn tất ✅"
                : file.status === "error"
                ? "Lỗi ❌"
                : `${file.progress}%`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
