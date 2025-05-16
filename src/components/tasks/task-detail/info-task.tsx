"use client";
import { Link2, Pencil, UserPlus } from "lucide-react";
import React from "react";
import { Task } from "~/lib/types";

export default function TaskInfo({
  task,
  onEdit,
  onLinkRequirement,
  onAssign,
}: {
  task: Task;
  onEdit: () => void;
  onLinkRequirement: () => void;
  onAssign: () => void;
}) {
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-primary mb-2">
          📝 Thông tin nhiệm vụ
        </h3>
        <div className="flex gap-2">
          <div className="tooltip" data-tip="Chỉnh sửa thông tin">
            <button onClick={onEdit}>
              <Pencil />
            </button>
          </div>
          <div className="tooltip" data-tip="Đính kèm yêu cầu liên quan">
            <button onClick={onLinkRequirement}>
              <Link2 />
            </button>
          </div>
          <div className="tooltip" data-tip="Giao việc">
            <button onClick={onAssign}>
              <UserPlus />
            </button>
          </div>
        </div>
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
