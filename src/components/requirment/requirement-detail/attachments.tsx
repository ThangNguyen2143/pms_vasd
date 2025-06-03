"use client";
import React, { useEffect, useState } from "react";
import { Download, ExternalLink, Paperclip } from "lucide-react";
import {
  downloadGzipBase64File,
  openGzipBase64FileInNewTab,
} from "~/utils/file-to-base64";
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
  const { getData, errorData } = useApi<FileDto>(); // ⚠️ chỉ dùng getData, không dùng state dùng chung
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({}); // trạng thái tải theo file_id

  const handleDownfile = async (file_id: number, type: string) => {
    setLoadingMap((prev) => ({ ...prev, [file_id]: true }));

    const res = await getData(
      "/requirements/file/" + encodeBase64({ file_id })
    );
    if (res) {
      if (type == "down") await downloadGzipBase64File(res);
      else await openGzipBase64FileInNewTab(res);
    }
    setLoadingMap((prev) => ({ ...prev, [file_id]: false }));
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
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
              📎 {f.file_name.replace(".gz", "")}{" "}
              {loadingMap[f.file_id] ? (
                <span className="loading loading-ball"></span>
              ) : (
                <>
                  <span
                    className="btn btn-circle text-blue-500 tooltip"
                    data-tip="Tải xuống"
                    onClick={() => handleDownfile(f.file_id, "down")}
                  >
                    <Download></Download>
                  </span>
                  <span
                    className="btn btn-circle text-blue-500 tooltip"
                    data-tip="Mở trong tab mới"
                    onClick={() => handleDownfile(f.file_id, "open")}
                  >
                    <ExternalLink />
                  </span>
                </>
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
