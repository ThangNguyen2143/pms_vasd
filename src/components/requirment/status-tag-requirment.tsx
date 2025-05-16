"use client";
import React from "react";
import { Star } from "lucide-react";

export default function StatusTag({
  status,
  onEvaluate,
}: {
  status: string;
  onEvaluate: () => void;
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">
          📌 Trạng thái
        </h3>
        <span className="badge badge-warning text-white px-4 py-2 rounded-full">
          {status}
        </span>
      </div>
      <button
        className="btn btn-sm btn-outline btn-primary tooltip"
        data-tip="Đánh giá yêu cầu"
        onClick={onEvaluate}
      >
        <Star size={16} className="mr-1" />
        Đánh giá
      </button>
    </div>
  );
}
