"use client";
import {
  BookmarkX,
  CirclePlay,
  OctagonX,
  RotateCcw,
  SquareCheckBig,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { UserAssignsTask } from "~/lib/types";

function TaskAssign({
  assignTo,
  task_id,
  onUpdate,
}: {
  assignTo?: UserAssignsTask[];
  task_id: number;
  onUpdate: () => Promise<void>;
}) {
  const { putData, errorData } = useApi<
    "",
    { task_id: number; status: string }
  >();
  const handleSubmit = async (status: string) => {
    const re = await putData("/tasks/status", { task_id, status });
    if (re) {
      await onUpdate();
      toast.success(re);
    }
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
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
            <p>Ngày giao: {assignee.date_assign}</p>
            {assignee.date_start ? (
              <p>Bắt đầu: {assignee.date_start}</p>
            ) : (
              <p>Người dùng chưa bắt đầu</p>
            )}
            {assignee.date_end ? <p>Kết thúc: {assignee.date_end}</p> : ""}
            <ul>
              <h4>Liên hệ:</h4>
              {assignee.contact?.map((ct) => {
                return (
                  <li key={assignee.user_id + ct.code}>
                    <span className="italic">{ct.code}:</span>
                    {ct.value}
                  </li>
                );
              })}
            </ul>
            <div className="join justify-end">
              <button
                className="btn btn-primary join-item tooltip"
                onClick={() => handleSubmit("START")}
                data-tip={"Bắt đầu"}
              >
                <CirclePlay />
              </button>
              <button
                className="btn btn-outline join-item btn-success tooltip"
                onClick={() => handleSubmit("END")}
                data-tip={"Hoàn thành"}
              >
                <SquareCheckBig />
              </button>
              <button
                className="btn btn-outline join-item btn-warning tooltip"
                onClick={() => handleSubmit("FAILED")}
                data-tip={"Thất bại"}
              >
                <OctagonX />
              </button>
              <button
                className="btn btn-outline join-item btn-accent tooltip"
                onClick={() => handleSubmit("REOPEN")}
                data-tip={"Mở lại"}
              >
                <RotateCcw />
              </button>
              <button
                className="btn btn-outline join-item btn-error tooltip"
                onClick={() => handleSubmit("CANCELED")}
                data-tip={"Hủy task"}
              >
                <BookmarkX />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>Công việc chưa được giao cho ai</div>
      )}
    </div>
  );
}

export default TaskAssign;
