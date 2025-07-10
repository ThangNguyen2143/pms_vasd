// hooks/use-upload-file.ts
import { useState } from "react";
import { prepareSmartUpload } from "~/utils/upload-large-file";
import axios, { AxiosResponse } from "axios";
import { DataResponse } from "~/lib/types";
import { verifySession } from "~/lib/dal";
import { v4 as uuidv4 } from "uuid";
import { blobToBase64 } from "~/utils/file-to-base64";
const DOMAIN = process.env.DOMAIN || "https://pmapi.vasd.vn/api";
interface UploadFileParams {
  file: File;
  uploadUrl: string;
  meta: Record<string, number>; // payload động: {id, task_id, bug_id...}
}
interface UploadFilesParams {
  files: File[];
  uploadUrl: string;
  meta: Record<string, number | string | string[] | object>; // payload động: {id, task_id, bug_id...}
}
export function useUploadFile<T = string>(method: "post" | "put" = "post") {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [response, setResponse] = useState<DataResponse<T> | null>(null);
  const CHUNK_SIZE = 700 * 1024;
  const uploadFile = async ({ file, uploadUrl, meta }: UploadFileParams) => {
    setIsUploading(true);
    setUploadError(null);
    setResponse(null);
    const session = await verifySession();
    if (!session) {
      setUploadError("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      setIsUploading(false);
      return null;
    }
    try {
      const prepared = await prepareSmartUpload(file);
      const payload = {
        data: {
          ...meta,
          files: prepared,
        },
        token: session.token || "",
      };
      let res: AxiosResponse<DataResponse<T>> | null = null;
      if (method === "put") {
        res = await axios.put<DataResponse<T>>(DOMAIN + uploadUrl, payload, {
          headers: { "Content-Type": "application/json" },
          maxBodyLength: Infinity,
        });
      } else {
        res = await axios.post<DataResponse<T>>(DOMAIN + uploadUrl, payload, {
          headers: { "Content-Type": "application/json" },
          maxBodyLength: Infinity,
        });
      }
      if (res.data.code !== 200) setUploadError(res.data.message);
      setResponse(res.data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setUploadError(error?.message || "Lỗi không xác định khi upload file.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  const uploadMultiFiles = async ({
    files,
    uploadUrl,
    meta,
  }: UploadFilesParams) => {
    setIsUploading(true);
    setUploadError(null);
    setResponse(null);
    const session = await verifySession();
    if (!session) {
      setUploadError("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      setIsUploading(false);
      return null;
    }
    try {
      const prepared = files.map((file) => prepareSmartUpload(file));
      const result = await Promise.all(prepared);
      const payload = {
        data: {
          ...meta,
          files: result,
        },
        token: session.token || "",
      };
      let res: AxiosResponse<DataResponse<T>> | null = null;
      if (method === "put") {
        res = await axios.put<DataResponse<T>>(DOMAIN + uploadUrl, payload, {
          headers: { "Content-Type": "application/json" },
          maxBodyLength: Infinity,
        });
      } else {
        res = await axios.post<DataResponse<T>>(DOMAIN + uploadUrl, payload, {
          headers: { "Content-Type": "application/json" },
          maxBodyLength: Infinity,
        });
      }
      console.log("data request:", payload.data);
      console.log("data response", res.data);
      if (res.data.code !== 200) setUploadError(res.data.message);
      setResponse(res.data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setUploadError(error?.message || "Lỗi không xác định khi upload file.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  async function uploadChunkedFile(
    file: File,
    uploadPath: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: Record<string, any>
  ): Promise<DataResponse<T> | null> {
    const session = await verifySession();
    if (!session) {
      setUploadError("Phiên làm việc đã hết hạn.");
      return null;
    }

    const fileId = uuidv4();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadUrl = "/api/upload/chunk";

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      const base64Data = await blobToBase64(chunk);

      const body = {
        fileId,
        sessionId: session.token,
        chunkIndex,
        totalChunks,
        isLastChunk: chunkIndex === totalChunks - 1,
        data: base64Data,
        uploadPath,
        fileType: file.type,
        fileName: file.name,
        meta,
      };

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setUploadError(err?.error || "Lỗi khi upload chunk.");
        return null;
      }

      if (chunkIndex === totalChunks - 1) {
        const json = await res.json();
        setResponse(json.data);
        return json.data;
      }
    }

    return null;
  }
  return {
    isUploading,
    uploadError,
    response,
    uploadFile,
    uploadChunkedFile,
    uploadMultiFiles,
  };
}
