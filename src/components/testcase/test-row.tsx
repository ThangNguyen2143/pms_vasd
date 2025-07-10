"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { encodeBase64 } from "~/lib/services";
import { ProductModule, UserDto, WorkStatus } from "~/lib/types";
import { TestcaseDto } from "~/lib/types/testcase";
import { status_with_color } from "~/utils/status-with-color";

interface TestRowProps {
  testcase: TestcaseDto;
  users: UserDto[];
  moduleList?: ProductModule[];
  statusList: WorkStatus[];
}

function TestRow({ testcase, users, statusList, moduleList }: TestRowProps) {
  const router = useRouter();
  const creator = users.find((u) => u.userid === testcase.created_by);
  const statusDisplay = statusList.find(
    (s) => s.code === testcase.status
  )?.display;
  const handleClickRow = (testcase: TestcaseDto) => {
    router.push("/test_case/" + encodeBase64({ testcase_id: testcase.id }));
  };
  console.log("testcase", testcase);
  return (
    <tr
      className="hover:bg-base-300 dark:hover:bg-gray-700"
      onClick={() => handleClickRow(testcase)}
    >
      <td className="px-4 py-2">{testcase.id}</td>
      <td className="px-4 py-2 truncate max-w-96">{testcase.name}</td>
      <td className="px-4 py-2">
        {moduleList?.find((m) => m.id === testcase.module)?.display ||
          testcase.module ||
          "Không rõ"}
      </td>
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
    </tr>
  );
}

export default TestRow;
