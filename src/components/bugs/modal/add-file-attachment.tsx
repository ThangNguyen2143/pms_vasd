"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { prepareCompressedBase64File } from "~/utils/file-to-base64";

export default function AddFileAttachmentModal({
  onClose,
  onUpdate,
  bug_id,
}: {
  onClose: () => void;
  onUpdate: () => Promise<void>;
  bug_id: number;
}) {
  const [file, setFile] = useState<File | null>();
  const { postData, errorData, isLoading } = useApi<
    "",
    {
      bug_id: number;
      files: {
        fileName: string;
        contentType: string;
        fileData: string; // Base64
      };
    }
  >();
  const handleAddFile = async () => {
    if (!file) return;
    const dataSend = {
      bug_id,
      files: await prepareCompressedBase64File(file),
    };
    await postData("/bugs/file", dataSend);
    if (errorData) toast.error(errorData.message);
    else {
      toast.success("Xử lý thành công");
      await onUpdate();
      onClose();
    }
  };
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
            disabled={isLoading}
          >
            {isLoading ? (
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
