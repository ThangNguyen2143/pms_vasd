"use client";
import React from "react";

export default function RequirmentLogs({
  logs,
}: {
  logs: { id: number; name: string; content: string; date: string }[];
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">
        📜 Nhật ký yêu cầu
      </h3>
      <div className="flex flex-col-reverse overflow-y-auto max-h-48">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log.id + " " + log.date}
              className="bg-base-100 p-3 mb-2 rounded border-l-4 border-info"
            >
              <p>
                <strong>{log.name}</strong>
              </p>
              <p>
                <i>{log.date}</i>
              </p>
              <p>{log.content}</p>
            </div>
          ))
        ) : (
          <p>
            <i>Chưa có nhật ký.</i>
          </p>
        )}
      </div>
    </div>
  );
}
