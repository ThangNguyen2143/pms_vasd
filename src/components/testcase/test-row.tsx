"use client";
import clsx from "clsx";
import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import { UserDto, WorkStatus } from "~/lib/types";
import { TestcaseDto } from "~/lib/types/testcase";
import { status_with_color } from "~/utils/status-with-color";

interface TestRowProps {
  testcase: TestcaseDto;
  users: UserDto[];
  statusList: WorkStatus[];
}

function TestRow({ testcase, users, statusList }: TestRowProps) {
  const creator = users.find((u) => u.userid === testcase.created_by);
  const statusDisplay = statusList.find(
    (s) => s.code === testcase.status
  )?.display;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-2">{testcase.id}</td>
      <td className="px-4 py-2 truncate max-w-96">{testcase.name}</td>
      <td className="px-4 py-2 w-fit">
        {creator?.userData.display_name || "Không rõ"}
      </td>
      <td className="px-4 py-2">{testcase.create_date}</td>
      <td className="px-4 py-2">{testcase.time_start}</td>
      <td className="px-4 py-2">{testcase.time_end}</td>
      <td className="px-4 py-2 truncate max-w-72">
        <span
          className={clsx(
            " badge",
            `badge-${status_with_color(testcase.status)}`
          )}
        >
          {statusDisplay || "Không rõ"}
        </span>
      </td>
      <td className="px-4 py-2">
        {/* Có thể thêm nút sửa/xoá ở đây */}
        <Link
          href={"/test_case/" + encodeBase64({ testcase_id: testcase.id })}
          className="btn btn-sm btn-secondary"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default TestRow;
