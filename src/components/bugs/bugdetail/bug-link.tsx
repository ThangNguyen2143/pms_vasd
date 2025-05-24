"use client";
import React from "react";

export default function BugLinks({
  taskId,
  testcaseId,
}: {
  taskId: number | null;
  testcaseId: number | null;
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">🔗 Liên kết</h3>
      <div className="space-y-1">
        <p>
          <strong>Task #:</strong>{" "}
          {taskId ? (
            <a className="link text-blue-500" href={`/tasks/${taskId}`}>
              {taskId}
            </a>
          ) : (
            <span className="italic text-gray-500">Chưa liên kết</span>
          )}
        </p>
        <p>
          <strong>TestCase #:</strong>{" "}
          {testcaseId ? (
            <a className="link text-blue-500" href={`/testcases/${testcaseId}`}>
              {testcaseId}
            </a>
          ) : (
            <span className="italic text-gray-500">Chưa liên kết</span>
          )}
        </p>
      </div>
    </div>
  );
}
