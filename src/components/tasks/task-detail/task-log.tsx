"use client";
import React from "react";
import { TaskLog } from "~/lib/types";

export default function Logs({ logs }: { logs: TaskLog[] }) {
  if (!logs.length) return null;

  return (
    <div className="bg-base-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-primary mb-2">
        📜 Nhật ký nhiệm vụ
      </h3>
      <div className="space-y-2">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className="bg-base-100 p-3 rounded-lg border-l-4 border-secondary"
          >
            <p>
              <strong>{log.name}</strong> – {log.date}
            </p>
            <p>{log.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
