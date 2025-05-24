"use client";
import { Link2, Pencil, UserPlus } from "lucide-react";
import React from "react";
import UpdatePriorytyComponent from "../modal/update-priority-btn";
import UpdateSeverityComponent from "../modal/update-severity-btn";

type BugInfoProps = {
  bug: {
    id: number;
    title: string;
    description: string;
    priority: string;
    severity: string;
    is_update: boolean;
    reported_at: string;
    reporter_name: string;
    tags: string[];
    status: string;
  };
};

export default function BugInfo({
  bug,
  onEdit,
  onLinkRequirement,
  onAssign,
  onUpdate,
}: {
  bug: BugInfoProps["bug"];
  onEdit: () => void;
  onLinkRequirement: () => void;
  onAssign: () => void;
  onUpdate: () => Promise<void>;
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-primary">🐞 Thông tin Bug</h2>
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
          <strong>Tiêu đề:</strong> {bug.title}
        </p>
        <p>
          <strong>Mô tả:</strong> {bug.description}
        </p>
        <div className="flex gap-2">
          <p>
            <strong>Ưu tiên:</strong> {bug.priority}
          </p>
          <UpdatePriorytyComponent
            bug_id={bug.id}
            onUpdate={onUpdate}
            priority={bug.priority}
          />
        </div>
        <div className="flex gap-2">
          <p>
            <strong>Ảnh hưởng:</strong> {bug.severity}
          </p>
          <UpdateSeverityComponent
            bug_id={bug.id}
            onUpdate={onUpdate}
            severity={bug.severity}
          />
        </div>

        <p>
          <strong>Đã cập nhật:</strong> {bug.is_update ? "Có" : "Chưa"}
        </p>
        <p>
          <strong>Người báo cáo:</strong> {bug.reporter_name}
        </p>
        <p>
          <strong>Thời gian:</strong> {bug.reported_at}
        </p>
        <p>
          <strong>Tag:</strong>{" "}
          {bug.tags.map((t) => (
            <span key={t} className="badge badge-outline mx-1 badge-primary">
              {t}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
