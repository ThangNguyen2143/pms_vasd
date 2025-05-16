"use client";
import React from "react";
import { Pencil } from "lucide-react";

export default function RequirementInfo({
  info,
  onEdit,
}: {
  info: {
    title: string;
    description: string;
    priority?: string;
    date_create: string;
    date_receive: string;
    date_end?: string;
    tags: string[];
  };
  onEdit: () => void;
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">
          📌 Thông tin yêu cầu
        </h3>
        <button
          className="btn btn-sm btn-ghost tooltip"
          data-tip="Chỉnh sửa"
          onClick={onEdit}
        >
          <Pencil size={18} />
        </button>
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-bold">Tiêu đề:</span> {info.title}
        </p>
        <p>
          <span className="font-bold">Mô tả:</span> {info.description}
        </p>
        <p>
          <span className="font-bold">Ưu tiên:</span>{" "}
          <span className="text-error font-semibold">{info.priority}</span>
        </p>
        <p>
          <span className="font-bold">Ngày tạo:</span> {info.date_create}
        </p>
        <p>
          <span className="font-bold">Ngày tiếp nhận:</span> {info.date_receive}
        </p>
        <p>
          <span className="font-bold">Hạn xử lý:</span> {info.date_end || "-"}
        </p>
        <p>
          <span className="font-bold">Từ khóa:</span>{" "}
          {info.tags.map((tag) => (
            <span key={tag} className="badge badge-info mr-1">
              {tag}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
