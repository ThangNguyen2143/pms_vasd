"use client";
import React from "react";
import { format_date } from "~/utils/fomat-date";
import { formatContent } from "~/utils/format-content";

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
      <div className="flex flex-col shadow max-h-96 overflow-y-auto">
        {logs
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((log, index) => (
            <div
              key={log.id + "" + log.date + "index" + index}
              className="bg-base-100 p-3 mb-2 rounded border-l-4 border-info"
            >
              <p>
                <strong>{log.name}</strong>
              </p>
              <p>
                <i>{format_date(log.date)}</i>
              </p>
              <p className="wrap-break-word">{formatContent(log.content)}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
