"use client";
import React from "react";
import { Paperclip } from "lucide-react";

export default function Attachments({
  files,
  onAdd,
}: {
  files: { file_id: number; file_name: string; file_type: string }[];
  onAdd: () => void;
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">
          📂 Tài liệu đính kèm
        </h3>
        <button
          className="btn btn-sm btn-ghost tooltip"
          data-tip="Thêm tài liệu"
          onClick={onAdd}
        >
          <Paperclip size={18} />
        </button>
      </div>
      {files.length > 0 ? (
        <ul className="space-y-1">
          {files.map((f) => (
            <li
              key={f.file_id}
              className="file bg-base-100 p-2 rounded border-l-4 border-neutral"
            >
              📎 {f.file_name} <em>({f.file_type})</em>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>Không có tài liệu đính kèm.</i>
        </p>
      )}
    </div>
  );
}
