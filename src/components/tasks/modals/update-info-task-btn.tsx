"use client";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { DataRating, Task } from "~/lib/types";

interface DataSend {
  task_id: number;
  title: string;
  description: string;
  dead_line: string;
}
interface Criteria {
  id: string;
  title: string;
  type: string;
}
export default function UpdateInfoTaskModal({
  task_info,
  criteriaType,
  critList,
  onUpdate,
  onClose,
}: {
  task_info: Task;
  critList: DataRating[];
  criteriaType?: { code: string; display: string }[];
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState<string>(task_info.title);
  const [description, setDescription] = useState<string>(task_info.description);
  const [deadline, setDeadline] = useState<string>(task_info.dead_line);
  const [criteriaList, setCriteriaList] = useState<Criteria[]>(
    critList.length > 0
      ? critList.map((item) => ({
          id: item.code,
          title: item.title,
          type: item.type,
        }))
      : [
          {
            id: Date.now().toString(),
            title: "",
            type: "",
          },
        ]
  );
  const { putData, errorData, isLoading } = useApi<string, DataSend>();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleSubmit = async () => {
    const data = {
      task_id: task_info.task_id,
      title,
      description,
      dead_line: deadline,
      acceptances: criteriaList.map((criteria) => ({
        title: criteria.title,
        type: criteria.type,
      })),
    };
    const re = await putData("/tasks", data);
    if (re == null) return;
    else {
      toast.success("Cập nhật thành công");
      await onUpdate();
      onClose();
    }
  };
  const addCriteria = () => {
    setCriteriaList([
      ...criteriaList,
      {
        id: Date.now().toString(),
        title: "",
        type: "",
      },
    ]);
  };

  const removeCriteria = (id: string) => {
    setCriteriaList(criteriaList.filter((criteria) => criteria.id !== id));
  };

  const updateCriteria = (id: string, field: keyof Criteria, value: string) => {
    setCriteriaList(
      criteriaList.map((criteria) =>
        criteria.id === id ? { ...criteria, [field]: value } : criteria
      )
    );
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box w-1/4">
        <h3 className="font-bold text-lg">Cập nhật thông tin nhiệm vụ</h3>
        <div className="flex flex-col gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Tiêu đề</legend>
            <input
              className="input input-bordered"
              type="text"
              placeholder="Tiêu đề công việc"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Mô tả</legend>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Mô tả công việc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Deadline</legend>
            <input
              className="input input-bordered"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </fieldset>
        </div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            <span>Tiêu chí chấp thuận</span>{" "}
            <span onClick={() => addCriteria()} className="btn">
              <Plus />
            </span>
          </legend>
          <div className="flex flex-col gap-1">
            {criteriaList.map((criteria) => (
              <div key={criteria.id} className="join items-center">
                <input
                  type="text"
                  className="input input-bordered w-full join-item "
                  placeholder="Nội dung tiêu chí"
                  value={criteria.title}
                  onChange={(e) =>
                    updateCriteria(criteria.id, "title", e.target.value)
                  }
                />

                <select
                  className="select select-bordered w-full join-item"
                  value={criteria.type}
                  onChange={(e) =>
                    updateCriteria(criteria.id, "type", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Chọn loại tiêu chí
                  </option>
                  {criteriaType &&
                    criteriaType.map((crit) => (
                      <option
                        value={crit.code}
                        key={crit.code + " " + criteria.id}
                      >
                        {crit.display}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={() => removeCriteria(criteria.id)}
                  className="btn btn-error   join-item "
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Lưu"
            )}
          </button>
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
