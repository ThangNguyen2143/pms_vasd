"use client";
import { Bug, ClipboardList, LucideIcon, Repeat, Route } from "lucide-react";
import Link from "next/link";
import React from "react";
import { encodeBase64 } from "~/lib/services";
import { WorkOverviewDTO } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import NotifyBtn from "../ui/notify-btn";

export default function StaffTreeView({ data }: { data: WorkOverviewDTO[] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-primary mb-4">
        🌳 Phân công theo nhân sự
      </h3>

      {/* Tree view container */}
      <div className="overflow-y-auto max-h-[580px]">
        <div className="grid grid-cols-1">
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

      <div className="collapse-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <WorkBox
          title="Task"
          Icon={ClipboardList}
          items={user.tasks}
          user_id={user.user_id}
        />
        <WorkBox
          title="Bug"
          Icon={Bug}
          items={user.bugs}
          user_id={user.user_id}
        />
        <WorkBox
          title="Testcase"
          Icon={Route}
          items={user.testcases}
          user_id={user.user_id}
        />
        <WorkBox
          title="Re-test"
          Icon={Repeat}
          items={user.bug_retests}
          user_id={user.user_id}
        />
      </div>
    </div>
  );
}

// function WorkBox({
//   title,
//   Icon,
//   items,
// }: {
//   Icon: LucideIcon;
//   title: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   items: any[];
// }) {
//   let urls: string[] = [];
//   if (title.includes("Task"))
//     urls = items.map(
//       (item) =>
//         `/task/${encodeBase64({
//           task_id: item.id,
//         })}`
//     );
//   else if (title.includes("Bug"))
//     urls = items.map(
//       (item) =>
//         `/bug/${encodeBase64({
//           bug_id: item.id,
//           product_id: item.product_id,
//         })}`
//     );
//   else if (title.includes("Re-test"))
//     urls = items.map(
//       (item) =>
//         `/bug/${encodeBase64({
//           bug_id: item.bug_id,
//           product_id: item.product_id,
//         })}`
//     );
//   else if (title.includes("Testcase"))
//     urls = items.map(
//       (item) =>
//         `/test_case/${encodeBase64({
//           testcase_id: item.testcase_id,
//         })}`
//     );
//   return (
//     <div className="bg-base-200 p-2 rounded collapse">
//       <input type="checkbox" id={title + "col"} defaultChecked />
//       <h5 className="collapse-title font-semibold text-sm mb-1 flex gap-2">
//         <Icon></Icon> <span>{title}</span>
//       </h5>
//       {items?.length > 0 ? (
//         <ul className="collapse-content space-y-1 text-xs">
//           {items.map((item, idx) => (
//             <li key={idx} className="pl-2 border-l-2 border-primary">
//               <Link href={urls[idx] || "/"}>
//                 <p className="font-medium">{item.title || item.name}</p>
//               </Link>
//               <p className="text-xs text-gray-500">
//                 {item.deadline ? `⏳ ${format_date(item.deadline)}` : ""}{" "}
//                 {item.status ? `| 📌 ${item.status}` : ""}
//               </p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="collapse-content italic text-gray-500 text-xs">
//           Không có công việc
//         </p>
//       )}
//     </div>
//   );
// }
function WorkBox({
  title,
  Icon,
  items,
  user_id,
}: {
  Icon: LucideIcon;
  title: string;
  user_id: number;
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
        <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
          {items.map((item, idx) => {
            const id_item = item.id || item.bug_id || item.testcase_id;
            return (
              <li key={idx} className="border-b pb-1">
                <Link href={urls[idx] || "/"}>
                  <p className="font-medium">{item.title || item.name}</p>
                </Link>
                <p className="text-xs text-gray-500">
                  {item.deadline ? `⏳ ${format_date(item.deadline)}` : ""}{" "}
                  {new Date(item.deadline).getTime() < new Date().getTime() && (
                    <NotifyBtn
                      type={title}
                      url={urls[idx]}
                      user_id={user_id}
                      className="btn-xs"
                      content={{
                        id: id_item,
                        message:
                          "Bạn được nhắc nhở thực hiện " +
                          title +
                          ". Có deadline: " +
                          item.deadline,
                        name: "Nhắc nhở thực hiện " + title,
                      }}
                    />
                  )}
                  {item.status ? `| 📌 ${item.status} ` : ""}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="italic text-gray-500">Không có công việc</p>
      )}
    </div>
  );
}
