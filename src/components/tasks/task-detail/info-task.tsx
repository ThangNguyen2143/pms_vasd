"use client";
import {
  BookmarkX,
  CirclePlay,
  OctagonX,
  Pencil,
  RotateCcw,
  SquareCheckBig,
  UserPlus,
} from "lucide-react";
import React from "react";
import { ProductModule, Task } from "~/lib/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { format_date } from "~/utils/fomat-date";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { encodeBase64 } from "~/lib/services";
import { useUser } from "~/providers/user-context";
export default function TaskInfo({
  task,
  onEdit,
  onAssign,
  onUpdate,
  onEditDeadline,
  hidden_button,
}: {
  task: Task;
  onEdit: () => void;
  onAssign: () => void;
  onUpdate: () => Promise<void>;
  onEditDeadline?: () => void;
  hidden_button?: boolean;
}) {
  const { user } = useUser();
  const { putData, errorData } = useApi<
    "",
    { task_id: number; status: string }
  >();
  const { data: moduleList, getData: getModules } = useApi<ProductModule[]>();
  useEffect(() => {
    getModules(
      "/product/" +
        encodeBase64({ type: "module", product_id: task.product_id }),
      "default"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.product_id]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleSubmit = async (status: string) => {
    const re = await putData("/tasks/status", {
      task_id: task.task_id,
      status,
    });
    if (re) {
      await onUpdate();
      toast.success(re);
    }
  };
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-primary mb-2">
          📝 Thông tin nhiệm vụ
        </h3>
        {!hidden_button && (
          <div className="flex gap-2">
            <div
              className="btn btn-circle tooltip"
              data-tip="Chỉnh sửa thông tin"
            >
              <button onClick={onEdit}>
                <Pencil />
              </button>
            </div>

            <div className="btn btn-circle tooltip" data-tip="Giao việc">
              <button onClick={onAssign}>
                <UserPlus />
              </button>
            </div>
            {user?.role == "Admin" && (
              <div className="join justify-end">
                <button
                  className="btn btn-primary btn-outline join-item tooltip"
                  onClick={() => handleSubmit("START")}
                  data-tip={"Bắt đầu"}
                >
                  <CirclePlay />
                </button>
                <button
                  className="btn btn-outline join-item btn-success tooltip"
                  onClick={() => handleSubmit("END")}
                  disabled={task.status == "DONE"}
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
                  disabled={task.status != "DONE" && task.status != "FAILED"}
                  data-tip={"Mở lại"}
                >
                  <RotateCcw />
                </button>
                <button
                  className="btn btn-outline join-item btn-error tooltip"
                  onClick={() => handleSubmit("CANCELED")}
                  disabled={task.status == "CANCELED"}
                  data-tip={"Hủy task"}
                >
                  <BookmarkX />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-bold w-32 inline-block">Tiêu đề:</span>{" "}
          {task.title} {"- (#" + task.task_id + ")"}
        </p>
        <div>
          <span className="font-bold w-32 inline-block">Mô tả:</span>{" "}
          <SafeHtmlViewer html={task.description} />
        </div>
        <p>
          <strong className="font-bold w-32 inline-block">Module:</strong>{" "}
          {moduleList
            ? moduleList.find((m) => m.id == task.module)?.display
            : task.module}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Ngày tạo:</span>{" "}
          {format_date(task.create_at)}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Bắt đầu:</span>{" "}
          {task.date_start ? format_date(task.date_start) : "-"}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Kết thúc:</span>{" "}
          {task.date_end ? format_date(task.date_end) : "-"}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Deadline:</span>{" "}
          {format_date(task.dead_line)}{" "}
          {!hidden_button &&
            task.status != "NEW" &&
            task.status != "DONE" &&
            task.status != "FAILED" && (
              <button
                className="btn btn-circle btn-ghost tooltip"
                data-tip={"Thay đổi deadline"}
                onClick={onEditDeadline}
              >
                <Pencil></Pencil>
              </button>
            )}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">
            Tình trạng <br />
            cập nhật:
          </span>{" "}
          {task.is_update ? "Đã cập nhật" : "Chưa cập nhật"}
        </p>
      </div>
    </div>
  );
}
