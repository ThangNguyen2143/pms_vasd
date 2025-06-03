"use client";
import { useState } from "react";

export default function UploadFileModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm file đính kèm</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Chọn file</label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Tải lên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
