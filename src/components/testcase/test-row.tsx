"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import { UserDto, WorkStatus } from "~/lib/types";
import { TestcaseDto } from "~/lib/types/testcase";

interface TestRowProps {
  testcase: TestcaseDto;
  users: UserDto[];
  statusList: WorkStatus[];
  product_id: string;
}

function TestRow({ testcase, users, statusList, product_id }: TestRowProps) {
  const creator = users.find((u) => u.userid === testcase.created_by);
  const statusDisplay = statusList.find(
    (s) => s.code === testcase.status
  )?.display;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-2">{testcase.id}</td>
      <td className="px-4 py-2">{testcase.name}</td>
      <td className="px-4 py-2">
        {creator?.userData.display_name || "Không rõ"}
      </td>
      <td className="px-4 py-2">{testcase.create_date}</td>
      <td className="px-4 py-2">{testcase.time_start}</td>
      <td className="px-4 py-2">{testcase.time_end}</td>
      <td className="px-4 py-2">
        <span className="badge">{statusDisplay || "Không rõ"}</span>
      </td>
      <td className="px-4 py-2">
        {/* Có thể thêm nút sửa/xoá ở đây */}
        <Link
          href={
            "/test_case/" +
            encodeBase64({ testcase_id: testcase.id, product_id })
          }
          className="btn btn-sm btn-secondary"
        >
          <Pencil />
        </Link>
      </td>
    </tr>
  );
}

export default TestRow;
