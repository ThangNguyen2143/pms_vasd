"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { UserDto, WorkStatus } from "~/lib/types";
import { TestcaseDto } from "~/lib/types/testcase";
import TestRow from "./test-row";

interface TestListProps {
  product_id: string;
  externalTestCreated?: TestcaseDto;
}
function TestList({ product_id, externalTestCreated }: TestListProps) {
  const endpoint = "/testcase/" + encodeBase64({ product_id });
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  const endpointStatus = "/system/config/eyJ0eXBlIjoidGVzdF9zdGF0dXMifQ==";

  const {
    data: testList,
    getData: getTestList,
    errorData,
  } = useApi<TestcaseDto[]>();
  const { data: userList, getData: getUser } = useApi<UserDto[]>();
  const { data: statusList, getData: getStatus } = useApi<WorkStatus[]>();

  useEffect(() => {
    if (product_id != "") getTestList(endpoint, "reload");
    getUser(endpointUser);
    getStatus(endpointStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);

  const fullTestList = testList ? [...testList] : [];
  if (
    externalTestCreated &&
    !fullTestList.find((t) => t.id === externalTestCreated.id)
  ) {
    fullTestList.push(externalTestCreated);
  }
  const fieldTable = [
    { code: "id", display: "ID" },
    { code: "name", display: "Tiêu đề" },
    { code: "created_by", display: "Người tạo" },
    { code: "create_at", display: "Ngày tạo" },
    { code: "time_start", display: "Ngày bắt đầu" },
    { code: "time_end", display: "Ngày kết thúc" },
    { code: "status", display: "Trạng thái" },
    { code: "", display: "Thao tác" },
  ];

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {fieldTable.map((field) => (
              <th key={field.code} className="px-4 py-3">
                {field.display}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fullTestList.length > 0 ? (
            fullTestList.map((testcase) => (
              <TestRow
                testcase={testcase}
                users={userList || []}
                statusList={statusList || []}
                key={testcase.id}
                product_id={product_id}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {errorData
                  ? errorData.code === 500
                    ? "Lỗi máy chủ, vui lòng thử lại sau"
                    : errorData.message
                  : product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Đang tải..."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TestList;
