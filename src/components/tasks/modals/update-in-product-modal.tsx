"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { TaskDTO } from "~/lib/types";

interface UpdateModalProps {
  list: number[];
  taskList: TaskDTO[] | null;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
function UpdateInProductModalConfirm({
  list,
  onClose,
  onUpdate,
  taskList,
}: UpdateModalProps) {
  const { postData, isLoading, errorData } = useApi<string>();
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
  }, [errorData]);
  const handleUpdate = async () => {
    const re = await postData("/tasks/update", { task_id: list });
    if (re == null) return;
    toast.success("Xử lý thành công");
    await onUpdate();
    onClose();
  };
  return (
    <div className="modal modal-open">
      <div className="modal-backdrop">
        <button onClick={onClose}></button>
      </div>
      <div className="modal-box">
        <h3>Xác nhận cập nhật các task:</h3>
        <ul className="list">
          {taskList &&
            taskList
              .filter((task) => list.includes(task.id))
              .map((task) => (
                <li key={task.id} className="list-row">
                  {task.title}
                </li>
              ))}
        </ul>
        <div className="modal-action">
          <button
            className="btn btn-secondary"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Xác nhận"
            )}
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateInProductModalConfirm;
