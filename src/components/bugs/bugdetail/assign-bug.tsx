"use client";
import React from "react";
import { BugAssign } from "~/lib/types";

type AssignBugProps = {
  assignee: BugAssign | null;
};

export default function AssignBug({ assignee }: AssignBugProps) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">👨‍💻 Giao việc</h3>
      {assignee ? (
        <div>
          <p>
            <strong>Người phụ trách:</strong> {assignee.name}
          </p>
          <p>
            <strong>Ngày giao:</strong> {assignee.date_start}
          </p>
        </div>
      ) : (
        <p className="italic text-gray-500">Chưa được giao</p>
      )}
    </div>
  );
}
