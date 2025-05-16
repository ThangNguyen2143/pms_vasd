"use client";
import React from "react";
import { ProjectDetailDto } from "~/lib/types";

export default function ProjectInfo({ info }: { info: ProjectDetailDto }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold text-primary border-b pb-2 mb-4">
        📁 Thông tin dự án
      </h2>
      <div className="space-y-2">
        <p>
          <span className="font-bold">Mã dự án:</span> {info.seft_code}
        </p>
        <p>
          <span className="font-bold">Tên:</span> {info.name}
        </p>
        <p>
          <span className="font-bold">Mô tả:</span> {info.description}
        </p>
        <p>
          <span className="font-bold">Ngày tạo:</span> {info.create_at}
        </p>
        <p>
          <span className="font-bold">Bắt đầu:</span> {info.start_date}
        </p>
        <p>
          <span className="font-bold">Kết thúc dự kiến:</span> {info.end_date}
        </p>
        <p>
          <span className="font-bold">Kết thúc thực tế:</span>{" "}
          {info.actual_end_date || "-"}
        </p>
      </div>
    </div>
  );
}
