"use client";
import React from "react";

type BugInfoProps = {
  bug: {
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

export default function BugInfo({ bug }: { bug: BugInfoProps["bug"] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-primary">🐞 Thông tin Bug</h2>
        <span className="badge badge-info">{bug.status}</span>
      </div>

      <div className="space-y-2">
        <p>
          <strong>Tiêu đề:</strong> {bug.title}
        </p>
        <p>
          <strong>Mô tả:</strong> {bug.description}
        </p>
        <p>
          <strong>Ưu tiên:</strong> {bug.priority}
        </p>
        <p>
          <strong>Ảnh hưởng:</strong> {bug.severity}
        </p>
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
