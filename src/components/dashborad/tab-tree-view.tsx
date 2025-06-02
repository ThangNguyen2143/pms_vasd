"use client";
import React from "react";
import { WorkOverviewDTO } from "~/lib/types";

export default function StaffTreeView({ data }: { data: WorkOverviewDTO[] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-primary mb-4">
        🌳 Phân công theo nhân sự
      </h3>

      {/* Tree view container */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-w-max">
          {data.map((user) => (
            <StaffColumn key={user.user_id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StaffColumn({ user }: { user: WorkOverviewDTO }) {
  return (
    <div className="bg-base-100 p-3 rounded shadow border">
      <h4 className="font-bold text-lg border-b pb-2 mb-2">
        {user.user_name || `Nhân sự ${user.user_id}`}
      </h4>

      <div className="space-y-3">
        <WorkBox title="📋 Task" items={user.tasks} />
        <WorkBox title="🐛 Bug" items={user.bugs} />
        <WorkBox title="🧪 Testcase" items={user.testcases} />
        <WorkBox title="🔁 Re-test" items={user.bug_retests} />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkBox({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="bg-base-200 p-2 rounded">
      <h5 className="font-semibold text-sm mb-1">{title}</h5>
      {items?.length > 0 ? (
        <ul className="space-y-1 text-xs">
          {items.map((item, idx) => (
            <li key={idx} className="pl-2 border-l-2 border-primary">
              <p className="font-medium">{item.title || item.name}</p>
              <p className="text-xs text-gray-500">
                {item.deadline ? `⏳ ${item.deadline}` : ""}{" "}
                {item.status ? `| 📌 ${item.status}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-500 text-xs">Không có công việc</p>
      )}
    </div>
  );
}
