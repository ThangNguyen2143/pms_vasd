"use client";
import React from "react";
import { FileTask } from "~/lib/types";

export default function Attachments({
  attachments,
}: {
  attachments: FileTask[];
}) {
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-primary mb-2">
        📎 Tệp đính kèm
      </h3>
      {!attachments.length ? (
        <span className="badge badge-ghost">Chưa có tệp nào!</span>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {attachments.map((file, idx) => (
            <li key={idx}>{file.file_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
