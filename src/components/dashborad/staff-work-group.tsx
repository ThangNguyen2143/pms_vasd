"use client";
import { Bug, ClipboardList, LucideIcon, Repeat, Route } from "lucide-react";
import Link from "next/link";
import React from "react";
import { encodeBase64 } from "~/lib/services";
import { WorkOverviewDTO } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

export default function StaffWorkGroup({ user }: { user: WorkOverviewDTO }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <WorkBox title="Task" Icon={ClipboardList} items={user.tasks} />
      <WorkBox title="Bug" Icon={Bug} items={user.bugs} />
      <WorkBox title="Testcase" Icon={Route} items={user.testcases} />
      <WorkBox title="Re-test" Icon={Repeat} items={user.bug_retests} />
    </div>
  );
}

function WorkBox({
  title,
  Icon,
  items,
}: {
  Icon: LucideIcon;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
}) {
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
        })}`
    );
  else if (title.includes("Re-test"))
    urls = items.map(
      (item) =>
        `/bug/${encodeBase64({
          bug_id: item.bug_id,
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
    <div className="bg-base-100 p-3 rounded shadow border">
      <h4 className="font-semibold text-primary mb-2 flex gap-2">
        <Icon />
        <span>{title}</span>
      </h4>
      {items?.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="border-b pb-1">
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
        <p className="italic text-gray-500">Không có công việc</p>
      )}
    </div>
  );
}
