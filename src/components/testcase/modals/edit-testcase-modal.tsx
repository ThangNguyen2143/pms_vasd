"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { EnviromentTest, TaskDTO, TestcaseDetail } from "~/lib/types";
type InfoTestcaseDetail = {
  name: string;
  description: string;
  task_id?: number;
  tags: string[];
  test_data: string;
  environment: string;
  result_expect: string;
};
export default function EditTestcaseModal({
  isOpen,
  product_id,
  onClose,
  testcase,
  environmentTests,
  onSubmit,
}: {
  isOpen: boolean;
  product_id: string;
  onClose: () => void;
  testcase: TestcaseDetail;
  environmentTests: EnviromentTest[];
  onSubmit: ({ info }: { info: InfoTestcaseDetail }) => void;
}) {
  const [formData, setFormData] = useState({
    name: testcase.name,
    description: testcase.description,
    environment: testcase.environment,
    tags: testcase.tags.join(", "),
    task_id: testcase.task?.id || 0,
    test_data: testcase.test_data || "",
    result_expect: testcase.result_expect,
  });
  const { getData: getlistTasks, data: tasks } = useApi<TaskDTO[]>();
  useEffect(() => {
    getlistTasks("/tasks/" + encodeBase64({ product_id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      info: {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
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
                {environmentTests.map((envT) => (
                  <option key={envT.code + "opt"} value={envT.code}>
                    {envT.display}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Liên kết task</label>
              <select
                className="select select-bordered w-full"
                value={formData.task_id}
                onChange={(e) =>
                  setFormData({ ...formData, task_id: Number(e.target.value) })
                }
              >
                <option value={0}>Chọn task</option>
                {tasks ? (
                  tasks.map((task) => (
                    <option key={task.id + "-ref"} value={task.id}>
                      {task.title}
                    </option>
                  ))
                ) : (
                  <option>Không có task nào</option>
                )}
              </select>
            </div>
            <div>
              <label className="block mb-1">Tags</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Ghi chú Phân cách bằng dấu phẩy"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="bloc mb-1">Dữ liệu đầu vào</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Nhập dữ liệu đầu vào (nếu có)"
                value={formData.test_data}
                onChange={(e) =>
                  setFormData({ ...formData, test_data: e.target.value })
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
