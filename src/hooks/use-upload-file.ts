// hooks/use-upload-file.ts
import { useState } from "react";
import { prepareSmartUpload } from "~/utils/upload-large-file";
import axios, { AxiosResponse } from "axios";
import { DataResponse } from "~/lib/types";
import { verifySession } from "~/lib/dal";

const DOMAIN = process.env.DOMAIN || "https://pmapi.vasd.vn/api";
interface UploadFileParams {
  file: File;
  uploadUrl: string;
  meta: Record<string, number>; // payload động: {id, task_id, bug_id...}
}

export function useUploadFile<T = string>(method: "post" | "put" = "post") {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [response, setResponse] = useState<DataResponse<T> | null>(null);

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

  return {
    isUploading,
    uploadError,
    response,
    uploadFile,
  };
}
