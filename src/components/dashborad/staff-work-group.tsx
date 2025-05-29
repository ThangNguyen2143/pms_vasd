"use client";
import React from "react";
import { WorkOverviewDTO } from "~/lib/types";

export default function StaffWorkGroup({ user }: { user: WorkOverviewDTO }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <WorkBox title="📋 Task" items={user.tasks} />
      <WorkBox title="🐛 Bug" items={user.bugs} />
      <WorkBox title="🧪 Testcase" items={user.testcases} />
      <WorkBox title="🔁 Re-test" items={user.bug_retests} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkBox({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="bg-base-100 p-3 rounded shadow border">
      <h4 className="font-semibold text-primary mb-2">{title}</h4>
      {items?.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="border-b pb-1">
              <p className="font-medium">{item.title || item.name}</p>
              <p className="text-xs text-gray-500">
                {item.deadline ? `⏳ ${item.deadline}` : ""}{" "}
                {item.status ? `| 📌 ${item.status}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-500">Không có công việc</p>
      )}
    </div>
  );
}
