"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { Task } from "~/lib/types";

interface DataSend {
  task_id: number;
  title: string;
  description: string;
  dead_line: string;
}

export default function UpdateInfoTaskModal({
  task_info,
  onUpdate,
  onClose,
}: {
  task_info: Task;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState<string>(task_info.title);
  const [description, setDescription] = useState<string>(task_info.description);
  const [deadline, setDeadline] = useState<string>(task_info.dead_line);
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
    };
    const re = await putData("/tasks", data);
    if (re == null) return;
    else {
      toast.success("Cập nhật thành công");
      await onUpdate();
      onClose();
    }
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
