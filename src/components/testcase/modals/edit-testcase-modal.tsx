"use client";
import { useState } from "react";
import { TestcaseDetail } from "~/lib/types";

export default function EditTestcaseModal({
  isOpen,
  onClose,
  testcase,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  testcase: TestcaseDetail;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: testcase.name,
    description: testcase.description,
    environment: testcase.environment,
    tags: testcase.tags.join(", "),
    result_expect: testcase.result_expect,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa testcase</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-1">Tên testcase</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Mô tả</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Môi trường</label>
              <select
                className="select select-bordered w-full"
                value={formData.environment}
                onChange={(e) =>
                  setFormData({ ...formData, environment: e.target.value })
                }
              >
                <option value="TEST">TEST</option>
                <option value="STAGING">STAGING</option>
                <option value="PRODUCTION">PRODUCTION</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">
                Tags (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Kết quả mong đợi</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={formData.result_expect}
                onChange={(e) =>
                  setFormData({ ...formData, result_expect: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
