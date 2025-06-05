"use client";
import {
  BookmarkX,
  CirclePlay,
  Link2,
  OctagonX,
  Pencil,
  RotateCcw,
  SquareCheckBig,
  UserPlus,
} from "lucide-react";
import React from "react";
import { Task } from "~/lib/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
export default function TaskInfo({
  task,
  onEdit,
  onLinkRequirement,
  onAssign,
  onUpdate,
  hidden_button,
}: {
  task: Task;
  onEdit: () => void;
  onLinkRequirement: () => void;
  onAssign: () => void;
  onUpdate: () => Promise<void>;
  hidden_button?: boolean;
}) {
  const { putData, errorData } = useApi<
    "",
    { task_id: number; status: string }
  >();

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
            <div
              className="btn btn-circle tooltip"
              data-tip="Đính kèm yêu cầu liên quan"
            >
              <button onClick={onLinkRequirement}>
                <Link2 />
              </button>
            </div>
            <div className="btn btn-circle tooltip" data-tip="Giao việc">
              <button onClick={onAssign}>
                <UserPlus />
              </button>
            </div>
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
        )}
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-bold w-32 inline-block">Tiêu đề:</span>{" "}
          {task.title}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Mô tả:</span>{" "}
          {task.description}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Ngày tạo:</span>{" "}
          {task.create_at}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Bắt đầu:</span>{" "}
          {task.date_start}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Kết thúc:</span>{" "}
          {task.date_end}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Deadline:</span>{" "}
          {task.dead_line}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">
            Tình trạng <br />
            cập nhật:
          </span>{" "}
          {task.is_update ? "Đã cập nhật" : "Chưa cập nhật"}
        </p>
        <p>
          <span className="font-bold w-32 inline-block">Yêu cầu liên kết:</span>
          {task.requirementTasks?.map((reqTask) => (
            <span key={reqTask.requirement_id} className="ml-1">
              [ID: {reqTask.requirement_id}] - {reqTask.requirement_title}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
