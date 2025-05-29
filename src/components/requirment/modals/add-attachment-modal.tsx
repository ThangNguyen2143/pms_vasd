"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUploadFile } from "~/hooks/use-upload-file";

export default function AddAttachmentModal({
  onClose,
  onUpdate,
  requirement_id,
}: {
  onClose: () => void;
  onUpdate: () => Promise<void>;
  requirement_id: number;
}) {
  const [file, setFile] = useState<File | null>();

  const { isUploading, uploadError, uploadFile } = useUploadFile("put");
  const handleAddFile = async () => {
    if (!file) return;
    const re = await uploadFile({
      file,
      uploadUrl: "/project/requirement/file",
      meta: { id: requirement_id },
    });
    if (re?.value != "") return;
    await onUpdate();
    toast.success("Tệp đính kèm đã được thêm thành công");
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

        <input
          type="file"
          className="file-input file-input-primary mt-4"
          name="fileSend"
          placeholder="Chọn tệp đính kèm"
          onChange={(e) =>
            setFile(
              e.target.files && e.target.files[0] ? e.target.files[0] : null
            )
          }
        />

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
