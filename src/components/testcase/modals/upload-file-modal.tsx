"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUploadFile } from "~/hooks/use-upload-file";

export default function UploadFileModal({
  isOpen,
  onClose,
  onUpdate,
  testcase_id,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
  testcase_id: number;
}) {
  const [file, setFile] = useState<File | null>();

  const { isUploading, uploadError, uploadFile } = useUploadFile();
  const handleAddFile = async () => {
    if (!file) return;
    const re = await uploadFile({
      file,
      uploadUrl: "/testcase/file",
      meta: { testcase_id },
    });
    if (re?.code != 200) return;
    toast.success("Tệp đính kèm đã được thêm thành công");
    await onUpdate();
    onClose();
  };
  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError);
    }
  }, [uploadError]);
  if (!isOpen) return null;
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
