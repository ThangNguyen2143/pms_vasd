"use client";
import { useEffect, useState } from "react";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import {
  EnviromentTest,
  ProductModule,
  TaskDTO,
  TestcaseDetail,
} from "~/lib/types";
type InfoTestcaseDetail = {
  name: string;
  description: string;
  task_id?: number;
  module: string;
  tags: string[];
  test_data: string;
  environment: string;
  result_expect: string;
};
export default function EditTestcaseModal({
  isOpen,
  product_id,
  modules,
  onClose,
  testcase,
  environmentTests,
  onSubmit,
}: {
  isOpen: boolean;
  modules: ProductModule[];
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
    module: testcase.module,
    tags: testcase.tags,
    task_id: testcase.task?.id || 0,
    test_data: testcase.test_data || "",
    result_expect: testcase.result_expect,
  });
  const [currentTag, setCurrentTag] = useState("");
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
      },
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl w-full">
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
              <RichTextEditor
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e })}
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
              <label className="label">Tags</label>
              <div className="flex gap-2">
                <input
                  className="input input-bordered flex-1"
                  type="text"
                  placeholder="Thêm tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button className="btn btn-outline" onClick={addTag}>
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="badge badge-primary">
                    {tag}
                    <button className="ml-2" onClick={() => removeTag(tag)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Module</label>
              <select
                className="select select-bordered w-full"
                value={formData.module}
                onChange={(e) =>
                  setFormData({ ...formData, module: e.target.value })
                }
              >
                <option value={""}>Chọn module</option>
                {modules ? (
                  modules.map((module) => (
                    <option key={module.id + "-ref"} value={module.id}>
                      {module.display}
                    </option>
                  ))
                ) : (
                  <option>Không có module nào</option>
                )}
              </select>
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
              <RichTextEditor
                value={formData.result_expect}
                onChange={(e) => setFormData({ ...formData, result_expect: e })}
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
