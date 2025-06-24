"use client";
import { Download, ExternalLink, Paperclip, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PreviewFileModal from "~/components/ui/file-reviewer/preview-file-modal";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { FileDto, RequirementFile } from "~/lib/types";
import {
  downloadGzipBase64File,
  openGzipBase64FileInNewTab,
} from "~/utils/file-to-base64";

function AttachmentTestcaseFile({
  files,
  testcase_id,
  onUpdate, // hàm để reload lại danh sách file sau khi thêm/xóa
  uploadFile,
}: {
  testcase_id: number;
  files: RequirementFile[];
  onUpdate: () => Promise<void>; // hàm để reload lại danh sách file sau khi thêm/xóa
  uploadFile: () => void;
}) {
  const { getData, errorData } = useApi<FileDto>(); // ⚠️ chỉ dùng getData, không dùng state dùng chung
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({}); // trạng thái tải theo file_id
  const [reviewFile, setReviewFile] = useState<File>();
  const { removeData: removeFile, errorData: errorRemoveFile } = useApi();
  const handleRemoveFile = async (file_id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tệp này?")) {
      const res = await removeFile(
        "/testcase/file/" + encodeBase64({ testcase_id, file_id })
      );
      if (res == "") {
        toast.success("Đã xóa tệp thành công.");
        // reload files after removing
        await onUpdate();
      }
    }
  };
  const handleDownfile = async (file_id: number, type: string) => {
    setLoadingMap((prev) => ({ ...prev, [file_id]: true }));

    const res = await getData(
      "/testcase/file/" + encodeBase64({ testcase_id, file_id })
    );
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
        <h3 className="text-lg font-semibold mb-2">📎 Tệp đính kèm</h3>
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
              className="file bg-base-100 p-2 rounded border-l-4 border-neutral"
            >
              <span className="truncate max-w-32">
                {" "}
                📎 {f.file_name.replace(".gz", "")}{" "}
              </span>

              {loadingMap[f.file_id] ? (
                <span className="loading loading-ball"></span>
              ) : (
                <>
                  <span
                    className="link text-blue-500 btn btn-ghost tooltip"
                    onClick={() => handleDownfile(f.file_id, "down")}
                    data-tip={"Tải xuống"}
                  >
                    <Download></Download>
                  </span>
                  <span
                    className="link text-blue-500 btn btn-ghost tooltip"
                    data-tip={"Mở file"}
                    onClick={() => handleDownfile(f.file_id, "open")}
                  >
                    <ExternalLink />
                  </span>
                  <span
                    className="btn btn-ghost text-error tooltip"
                    data-tip="Xóa tệp"
                    onClick={() => handleRemoveFile(f.file_id)}
                  >
                    <X />
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
      {reviewFile && (
        <PreviewFileModal
          file={reviewFile}
          onClose={() => setReviewFile(undefined)}
        />
      )}
    </div>
  );
}

export default AttachmentTestcaseFile;
