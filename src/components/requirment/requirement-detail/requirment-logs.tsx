"use client";
import React from "react";
import { useUser } from "~/providers/user-context";
import { format_date } from "~/utils/fomat-date";
import { formatContent } from "~/utils/format-content";

export default function RequirmentLogs({
  logs,
}: {
  logs: { id: number; name: string; content: string; date: string }[];
}) {
  const user = useUser();
  if (
    !user.user ||
    user.user?.role === "Guess" ||
    user.user?.role === "Customer"
  ) {
    return null; // Không hiển thị nhật ký cho người dùng khách
  }
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">
        📜 Nhật ký yêu cầu
      </h3>
      <div className="flex flex-col overflow-y-auto max-h-96">
        {logs.length > 0 ? (
          logs
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((log) => (
              <div
                key={log.id + " " + log.date}
                className="bg-base-100 p-3 mb-2 rounded border-l-4 border-info"
              >
                <p>
                  <strong>{log.name}</strong>
                </p>
                <p>
                  <i>{format_date(log.date)}</i>
                </p>
                <p>{formatContent(log.content)}</p>
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
