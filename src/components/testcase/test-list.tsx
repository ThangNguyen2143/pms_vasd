"use client";
import { ProductModule, UserDto, WorkStatus } from "~/lib/types";
import { TestcaseDto } from "~/lib/types/testcase";
import TestRow from "./test-row";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PagingComponent from "../ui/paging-table";

interface TestListProps {
  product_id: string;
  testList?: TestcaseDto[];
  userList?: UserDto[];
  moduleList?: ProductModule[];
  statusList?: WorkStatus[];
  externalTestCreated?: TestcaseDto;
}
function TestList({
  product_id,
  testList,
  userList,
  moduleList,
  statusList,
  externalTestCreated,
}: TestListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fullTestList = testList
    ? [...testList.sort((a, b) => b.id - a.id)]
    : [];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(fullTestList.length / 10);
  // ⬅️ Khi load lại, đọc từ URL
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    if (pageParam >= 1 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    }
  }, [searchParams, totalPages]);
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    setCurrentPage(page);
  };

  // 🔄 Cắt dữ liệu theo trang
  const startIndex = (currentPage - 1) * 10;
  const currentTests = fullTestList.slice(startIndex, startIndex + 10);
  if (
    externalTestCreated &&
    !fullTestList.find((t) => t.id === externalTestCreated.id)
  ) {
    fullTestList.push(externalTestCreated);
  }
  const fieldTable = [
    { code: "id", display: "ID" },
    { code: "name", display: "Tiêu đề" },
    { code: "module", display: "Module" },
    { code: "created_by", display: "Người tạo" },
    { code: "create_at", display: "Ngày tạo" },
    { code: "time_start", display: "Ngày bắt đầu" },
    { code: "time_end", display: "Ngày kết thúc" },
    { code: "status", display: "Trạng thái" },
  ];

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {fieldTable.map((field) => (
              <th key={field.code} className="p-2">
                {field.display}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTests.length > 0 ? (
            currentTests
              .sort((a, b) => b.id - a.id)
              .map((testcase) => (
                <TestRow
                  testcase={testcase}
                  moduleList={moduleList || []}
                  users={userList || []}
                  statusList={statusList || []}
                  key={testcase.id}
                />
              ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Chưa có testcase nào cho phần mềm này"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PagingComponent
        currentPage={currentPage}
        totalPages={totalPages}
        handleChangePage={handlePageChange}
      />
    </div>
  );
}

export default TestList;
