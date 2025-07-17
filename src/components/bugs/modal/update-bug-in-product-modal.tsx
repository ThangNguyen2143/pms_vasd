"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { BugDto } from "~/lib/types";

interface UpdateModalProps {
  list: number[];
  bugList: BugDto[] | null;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
function UpdateBugInProductModalConfirm({
  list,
  onClose,
  onUpdate,
  bugList,
}: UpdateModalProps) {
  const { postData, isLoading, errorData } = useApi<string>();
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
  }, [errorData]);
  const handleUpdate = async () => {
    const re = await postData("/bugs/update", { bug_id: list });
    // const re = null;
    if (re == null) return;
    toast.success(re || "Xử lý thành công");
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
          {bugList &&
            bugList
              .filter((bug) => list.includes(bug.bug_id))
              .map((bug) => (
                <li key={bug.bug_id} className="list-row">
                  {bug.name}
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

export default UpdateBugInProductModalConfirm;
