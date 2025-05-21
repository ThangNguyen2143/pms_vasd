"use client";
import React from "react";
import { Paperclip } from "lucide-react";
import { downloadGzipBase64File } from "~/utils/file-to-base64";
import { useApi } from "~/hooks/use-api";
import { FileDto } from "~/lib/types";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";

export default function Attachments({
  files,
  onAdd,
}: {
  files: { file_id: number; file_name: string; file_type: string }[];
  onAdd: () => void;
}) {
  const { data, getData, errorData, isLoading } = useApi<FileDto>();

  const handleDownfile = async (file_id: number) => {
    await getData("/requirements/file/" + encodeBase64({ file_id }));
    if (data) {
      await downloadGzipBase64File(data);
    }
    if (errorData) toast.error(errorData.message);
  };
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">
          📂 Tài liệu đính kèm
        </h3>
        <button
          className="btn btn-sm btn-ghost tooltip"
          data-tip="Thêm tài liệu"
          onClick={onAdd}
        >
          <Paperclip size={18} />
        </button>
      </div>
      {files.length > 0 ? (
        <ul className="space-y-1">
          {files.map((f) => (
            <li
              key={f.file_id}
              className="file bg-base-100 p-2 rounded border-l-4 border-neutral"
            >
              📎 {f.file_name}{" "}
              {isLoading ? (
                <span className="loading loading-ball"></span>
              ) : (
                <span
                  className="link"
                  onClick={() => handleDownfile(f.file_id)}
                >
                  Tải về
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>Không có tài liệu đính kèm.</i>
        </p>
      )}
    </div>
  );
}
