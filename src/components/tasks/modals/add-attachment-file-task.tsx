"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUploadFile } from "~/hooks/use-upload-file";

export default function AddFileAttachmentModal({
  onClose,
  onUpdate,
  task_id,
}: {
  onClose: () => void;
  onUpdate: () => Promise<void>;
  task_id: number;
}) {
  const [files, setFile] = useState<File[]>([]);

  const { isUploading, uploadError, uploadChunkedFile } = useUploadFile();
  const [fileUploadStatus, setFileUploadStatus] = useState<
    { name: string; status: "idle" | "uploading" | "done" | "error" }[]
  >([]);
  const handleAddFile = async () => {
    if (files.length > 0) {
      await Promise.all(
        files.map(async (file, index) => {
          // Cập nhật trạng thái đang upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = "uploading";
            return next;
          });

          const res = await uploadChunkedFile(file, "/tasks/file", {
            task_id,
          });

          // Cập nhật trạng thái sau khi upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = res && res.code == 200 ? "done" : "error";
            return next;
          });
        })
      );
    } else {
      toast.info("Chưa chọn file nào!");
      return;
    }
    toast.success("Tệp đính kèm đã được thêm thành công");
    await onUpdate();
    onClose();
  };
  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError);
    }
  }, [uploadError]);
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg ">Thêm tệp đính kèm</h3>

        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Chọn tệp đính kèm</legend>
            <input
              type="file"
              className="file-input file-input-primary mt-4"
              name="fileSend"
              multiple
              placeholder="Chọn tệp đính kèm"
              onChange={(e) => {
                const selected = e.target.files;
                if (selected) {
                  const newFiles = Array.from(selected);

                  // Thêm file mới vào danh sách cũ (tránh trùng tên)
                  setFile((prev) => {
                    const existingNames = new Set(prev.map((f) => f.name));
                    const uniqueNewFiles = newFiles.filter(
                      (f) => !existingNames.has(f.name)
                    );
                    return [...prev, ...uniqueNewFiles];
                  });

                  // Thêm trạng thái upload tương ứng
                  setFileUploadStatus((prev) => {
                    const existingNames = new Set(prev.map((f) => f.name));
                    const newStatus = newFiles
                      .filter((f) => !existingNames.has(f.name))
                      .map((f) => ({
                        name: f.name,
                        status: "idle" as const,
                      }));
                    return [...prev, ...newStatus];
                  });

                  // Reset input để cho phép chọn lại cùng file (bypass browser caching)
                  e.target.value = "";
                }
              }}
            />
          </fieldset>
          {fileUploadStatus.length > 0 && (
            <ul className="mt-2 space-y-1">
              {fileUploadStatus.map((file, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span>{file.name}</span>
                  {file.status === "uploading" && (
                    <span className="loading loading-spinner loading-xs text-info" />
                  )}
                  {file.status === "done" && (
                    <span className="text-success">✓ Đã tải lên</span>
                  )}
                  {file.status === "error" && (
                    <span className="text-error">✕ Lỗi</span>
                  )}
                  <button
                    onClick={() => {
                      setFile((prev) => prev.filter((_, i) => i !== idx));
                      setFileUploadStatus((prev) =>
                        prev.filter((_, i) => i !== idx)
                      );
                    }}
                    className="btn btn-xs btn-error"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddFile}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
