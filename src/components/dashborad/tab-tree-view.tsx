"use client";
import Link from "next/link";
import React from "react";
import { encodeBase64 } from "~/lib/services";
import { WorkOverviewDTO } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

export default function StaffTreeView({ data }: { data: WorkOverviewDTO[] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-primary mb-4">
        🌳 Phân công theo nhân sự
      </h3>

      {/* Tree view container */}
      <div className="overflow-auto max-h-[580px]">
        <div className="grid grid-cols-1 min-w-max">
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
    <div tabIndex={0} className="collapse bg-base-100 border-base-300 border">
      <input type="checkbox" id={user.user_id + "collapse"} defaultChecked />
      <h4 className="collapse-title font-bold text-lg border-b pb-2 mb-2">
        {user.user_name || `Nhân sự ${user.user_id}`}
      </h4>

      <div className="collapse-content space-y-3">
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
  let urls: string[] = [];
  if (title.includes("Task"))
    urls = items.map(
      (item) =>
        `/task/${encodeBase64({
          task_id: item.id,
        })}`
    );
  else if (title.includes("Bug"))
    urls = items.map(
      (item) =>
        `/bug/${encodeBase64({
          bug_id: item.id,
          product_id: item.product_id,
        })}`
    );
  else if (title.includes("Re-test"))
    urls = items.map(
      (item) =>
        `/bug/${encodeBase64({
          bug_id: item.bug_id,
          product_id: item.product_id,
        })}`
    );
  else if (title.includes("Testcase"))
    urls = items.map(
      (item) =>
        `/test_case/${encodeBase64({
          testcase_id: item.testcase_id,
        })}`
    );
  return (
    <div className="bg-base-200 p-2 rounded collapse">
      <input type="checkbox" id={title + "col"} defaultChecked />
      <h5 className="collapse-title font-semibold text-sm mb-1">{title}</h5>
      {items?.length > 0 ? (
        <ul className="collapse-content space-y-1 text-xs">
          {items.map((item, idx) => (
            <li key={idx} className="pl-2 border-l-2 border-primary">
              <Link href={urls[idx] || "/"}>
                <p className="font-medium">{item.title || item.name}</p>
              </Link>
              <p className="text-xs text-gray-500">
                {item.deadline ? `⏳ ${format_date(item.deadline)}` : ""}{" "}
                {item.status ? `| 📌 ${item.status}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="collapse-content italic text-gray-500 text-xs">
          Không có công việc
        </p>
      )}
    </div>
  );
}
