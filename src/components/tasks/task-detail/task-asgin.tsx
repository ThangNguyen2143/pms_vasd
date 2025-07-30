"use client";

import { CirclePlay, SquareCheckBig, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UserAssignsTask } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import ConfirmDeleteAssign from "../modals/confirm-delete-assign";
import { useApi } from "~/hooks/use-api";
import { toast } from "sonner";

function TaskAssign({
  assignTo,
  onUpdate,
  task_id,
  onSendNotify,
}: {
  assignTo?: UserAssignsTask[];
  task_id: number;
  onUpdate: () => Promise<void>;
  onSendNotify: (id: number) => Promise<void>;
}) {
  const [openConfirmRemove, setOpenConfirmRemove] = useState<number | null>(
    null
  );
  const { putData, errorData } = useApi<
    "",
    { task_id: number; status: string }
  >();
  const handleSubmit = async (status: string) => {
    const re = await putData("/tasks/status", {
      task_id,
      status,
    });
    if (re) {
      await onUpdate();
      toast.success(re);
    }
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  //
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-primary mb-2">
        👥 Người được giao
      </h3>
      {assignTo ? (
        assignTo.map((assignee) => (
          <div
            className="bg-base-100 p-3 rounded-lg border-l-4 border-info"
            key={assignee.user_id}
          >
            <p>
              <strong>{assignee.name}</strong>
            </p>
            <p>Ngày giao: {format_date(assignee.date_assign)}</p>
            <p>Deadline: {format_date(assignee.cur_deadLine)}</p>
            {assignee.date_start ? (
              <p>Bắt đầu: {format_date(assignee.date_start)}</p>
            ) : (
              <p>Người dùng chưa bắt đầu</p>
            )}
            {assignee.date_end ? (
              <p>Kết thúc: {format_date(assignee.date_end)}</p>
            ) : (
              ""
            )}
            <div className="flex justify-end">
              <div className="join justify-end">
                {!assignee.date_start && (
                  <button
                    className="btn btn-primary btn-outline join-item btn-sm tooltip"
                    onClick={() => handleSubmit("START")}
                    data-tip={"Bắt đầu"}
                  >
                    <CirclePlay />
                  </button>
                )}
                {assignee.date_start && !assignee.date_end && (
                  <button
                    className="btn btn-outline join-item btn-sm btn-success tooltip"
                    onClick={() => handleSubmit("END")}
                    data-tip={"Hoàn thành"}
                  >
                    <SquareCheckBig />
                  </button>
                )}
                <button
                  className="btn btn-sm join-item btn-error tooltip"
                  data-tip="Xóa người được giao"
                  onClick={() => setOpenConfirmRemove(assignee.user_id)}
                >
                  <X></X>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>Công việc chưa được giao cho ai</div>
      )}
      {openConfirmRemove && (
        <ConfirmDeleteAssign
          task_id={task_id}
          member={openConfirmRemove}
          onClose={() => setOpenConfirmRemove(null)}
          onUpdate={() => onSendNotify(openConfirmRemove)}
        />
      )}
    </div>
  );
}

export default TaskAssign;
