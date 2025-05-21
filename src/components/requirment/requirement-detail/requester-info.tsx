"use client";
import React from "react";
import { Pencil } from "lucide-react";

export default function RequesterInfo({
  requester,
  onEdit,
  location,
}: {
  requester: {
    requester: string;
    location_id: number;
    role: string;
    add_in: string;
  };
  location?: string;
  onEdit: () => void;
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">👤 Người yêu cầu</h3>
        <button
          className="btn btn-sm btn-ghost tooltip"
          data-tip="Chỉnh sửa người yêu cầu"
          onClick={onEdit}
        >
          <Pencil size={18} />
        </button>
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-bold">Họ tên:</span> {requester.requester}
        </p>
        <p>
          <span className="font-bold">Khoa/phòng:</span> #
          {requester.location_id} {location}
        </p>
        <p>
          <span className="font-bold">Vai trò:</span> {requester.role || "-"}
        </p>
        <p>
          <span className="font-bold">Ngày gửi:</span> {requester.add_in}
        </p>
      </div>
    </div>
  );
}
