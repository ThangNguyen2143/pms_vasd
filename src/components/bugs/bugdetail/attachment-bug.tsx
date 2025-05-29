"use client";
import { ExternalLink, Paperclip } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { FileDto, RequirementFile } from "~/lib/types";
import { openGzipBase64FileInNewTab } from "~/utils/file-to-base64";

export default function BugAttachments({
  files,
  uploadFile,
}: {
  files: RequirementFile[];
  uploadFile: () => void;
}) {
  const { getData } = useApi<FileDto>(); // ⚠️ chỉ dùng getData, không dùng state dùng chung
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({}); // trạng thái tải theo file_id

  const handleDownfile = async (file_id: number) => {
    setLoadingMap((prev) => ({ ...prev, [file_id]: true }));

    const res = await getData("/bugs/file/" + encodeBase64({ file_id }));
    if (res) {
      await openGzipBase64FileInNewTab(res);
    } else {
      toast.error("Tải file thất bại hoặc không tìm thấy file.");
    }

    setLoadingMap((prev) => ({ ...prev, [file_id]: false }));
  };
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex w-full justify-between">
        <h3 className="text-lg font-semibold text-primary mb-2">
          📎 Tệp đính kèm
        </h3>
        <div className="tooltip tooltip-bottom" data-tip="Thêm tệp đính kèm">
          <button
            className="btn btn-outline btn-primary btn-sm"
            onClick={() => uploadFile()}
          >
            <Paperclip />
          </button>
        </div>
      </div>

      {files.length > 0 ? (
        <ul className="space-y-1">
          {files.map((f) => (
            <li
              key={f.file_id}
              className="bg-base-100 p-2 rounded border-l-4 border-neutral flex items-center"
            >
              📎 {f.file_name.replace(".gz", "")}{" "}
              {loadingMap[f.file_id] ? (
                <span className="loading loading-ball"></span>
              ) : (
                <span
                  className="link text-blue-500 hover:underline cursor-pointer"
                  onClick={() => handleDownfile(f.file_id)}
                >
                  <ExternalLink />
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
