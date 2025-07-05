"use client";
import { Download, ExternalLink, Paperclip, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import PreviewFileModal from "~/components/ui/file-reviewer/preview-file-modal";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { FileDto, RequirementFile } from "~/lib/types";
import {
  downloadGzipBase64File,
  openGzipBase64FileInNewTab,
} from "~/utils/file-to-base64";

export default function Attachments({
  attachments,
  onUpdate, // hàm để reload lại danh sách file sau khi thêm/xóa
  uploadFile,
}: {
  attachments: RequirementFile[];
  onUpdate: () => Promise<void>; // hàm để reload lại danh sách file sau khi thêm/xóa
  uploadFile: () => void;
}) {
  const { getData, errorData } = useApi<FileDto>(); // ⚠️ chỉ dùng getData, không dùng state dùng chung
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({}); // trạng thái tải theo file_id
  const [reviewFile, setReviewFile] = useState<File>();
  const { removeData: removeFile, errorData: errorRemoveFile } = useApi();
  const handleRemoveFile = async (file_id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tệp này?")) {
      const res = await removeFile("/tasks/file/" + encodeBase64({ file_id }));
      if (res == "") {
        toast.success("Đã xóa tệp thành công.");
        // reload files after removing
        onUpdate();
      }
    }
  };
  const handleDownfile = async (file_id: number, type: string) => {
    setLoadingMap((prev) => ({ ...prev, [file_id]: true }));

    const res = await getData("/tasks/file/" + encodeBase64({ file_id }));
    if (res)
      if (type == "down") await downloadGzipBase64File(res);
      else setReviewFile(await openGzipBase64FileInNewTab(res));

    setLoadingMap((prev) => ({ ...prev, [file_id]: false }));
  };
  useEffect(() => {
    if (errorRemoveFile) toast.error(errorRemoveFile.message);
  }, [errorRemoveFile]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="flex justify-between">
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
      {attachments.length > 0 ? (
        <ul className="space-y-1">
          {attachments.map((f) => (
            <li
              key={f.file_id}
              className="flex items-center bg-base-100 p-2 rounded border-l-4 border-neutral"
            >
              <div className="max-w-48 truncate">
                📎{f.file_name.replace(".gz", "")}
              </div>
              {loadingMap[f.file_id] ? (
                <span className="loading loading-ball"></span>
              ) : (
                <div>
                  <span
                    className="btn btn-circle text-blue-500 tooltip"
                    data-tip="Tải xuống"
                    onClick={() => handleDownfile(f.file_id, "down")}
                  >
                    <Download></Download>
                  </span>
                  <span
                    className="btn btn-circle text-blue-500 tooltip"
                    data-tip="Mở tệp"
                    onClick={() => handleDownfile(f.file_id, "open")}
                  >
                    <ExternalLink />
                  </span>
                  <span
                    className="btn btn-circle text-red-500 tooltip"
                    data-tip="Xóa tài liệu"
                    onClick={() => handleRemoveFile(f.file_id)}
                  >
                    <X />
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>Không có tài liệu đính kèm.</i>
        </p>
      )}
      {reviewFile && (
        <PreviewFileModal
          file={reviewFile}
          onClose={() => setReviewFile(undefined)}
        />
      )}
    </div>
  );
}
