"use client";
import { BadgeInfo } from "lucide-react";
import React, { useState } from "react";
import InforTaskRef from "../modal/info-task-ref";
import Link from "next/link";
import { encodeBase64 } from "~/lib/services";

export default function BugLinks({
  taskId,
  testcaseId,
  task_name,
  testcase_name,
}: {
  taskId: number | null;
  testcaseId: number | null;
  task_name: string | null;
  testcase_name: string | null;
}) {
  const [showTaskModal, setshowTaskModal] = useState(false);

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">🔗 Liên kết</h3>
      <div className="space-y-1">
        <p>
          <strong>Task #:</strong>{" "}
          {task_name ? (
            <>
              {task_name}{" "}
              <span
                onClick={() => setshowTaskModal(true)}
                className="badge badge-info badge-outline"
              >
                <BadgeInfo />
              </span>
            </>
          ) : (
            <span className="italic text-gray-500">Chưa liên kết</span>
          )}
        </p>
        <p>
          <strong>TestCase #:</strong>{" "}
          {testcaseId ? (
            <Link
              className="link text-blue-500"
              href={`/test_case/${encodeBase64({ testcase_id: testcaseId })}`}
            >
              {testcase_name}
            </Link>
          ) : (
            <span className="italic text-gray-500">Chưa liên kết</span>
          )}
        </p>
      </div>
      {showTaskModal && taskId && (
        <InforTaskRef
          task_id={taskId}
          onClose={() => setshowTaskModal(false)}
        />
      )}
    </div>
  );
}
