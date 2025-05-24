"use client";
import React from "react";

type Log = {
  id: number;
  name: string;
  content: string;
  date: string;
};

export default function BugLogs({ logs }: { logs: Log[] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">
        📜 Lịch sử bug
      </h3>
      {logs.map((log) => (
        <div
          key={log.id + "" + log.date}
          className="bg-base-100 p-3 mb-2 rounded border-l-4 border-info"
        >
          <p>
            <strong>{log.name}</strong> – {log.date}
          </p>
          <p>{log.content}</p>
        </div>
      ))}
    </div>
  );
}
