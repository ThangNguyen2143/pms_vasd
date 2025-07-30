import { BugDto } from "~/lib/types";
import BugRow from "./bug-row";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PagingComponent from "../ui/paging-table";
interface BugListProps {
  product_id: string;
  bugList?: BugDto[];
  onUpdateInProduct: (id: number[]) => void;
}
function BugList({ product_id, bugList, onUpdateInProduct }: BugListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const fullBugList = bugList
    ? [...bugList.sort((a, b) => b.bug_id - a.bug_id)]
    : [];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectBug, setSelectBug] = useState<number[]>([]);
  const totalPages = Math.ceil(fullBugList.length / 10);

  // ⬅️ Khi load lại, đọc từ URL
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    if (pageParam >= 1 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    }
    if (pageParam > totalPages) {
      setCurrentPage(1);
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
  const currentBugs = fullBugList.slice(startIndex, startIndex + 10);
  const fieldTable = [
    { code: "id", display: "ID" },
    { code: "name", display: "Tiêu đề" },
    { code: "create_by", display: "Người tạo" },
    { code: "date_create", display: "Ngày tạo" },
    { code: "dead_line", display: "Deadline" },
    { code: "status", display: "Trạng thái" },
    { code: "update", display: "" },
  ];
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectBug(
        currentBugs.filter((bug) => !bug.is_update).map((bug) => bug.bug_id)
      );
    } else {
      setSelectBug([]);
    }
  };
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {fieldTable.map((field) => (
              <th key={field.code} className="px-4 py-3">
                {field.display != "" ? (
                  field.display
                ) : (
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectBug.length ===
                          currentBugs.filter((bug) => !bug.is_update).length &&
                        currentBugs.length > 0
                      }
                    />
                  </label>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentBugs.length > 0 ? (
            currentBugs.map((bug) => (
              <BugRow
                key={"bug" + bug.bug_id}
                isSelected={selectBug.includes(bug.bug_id)}
                setSelect={(id: number, isSelected: boolean) => {
                  if (isSelected) {
                    setSelectBug((pre) => [...pre, id]);
                  } else {
                    setSelectBug((pre) => pre.filter((t) => t != id));
                  }
                }}
                bug={bug}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Chưa có bug nào được báo cáo"}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={9} className="text-end">
              {selectBug.length > 0 && (
                <button
                  className="btn btn-accent"
                  onClick={() => onUpdateInProduct(selectBug)}
                >
                  Cập nhật trong hệ thống
                </button>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
      <PagingComponent
        currentPage={currentPage}
        totalPages={totalPages}
        handleChangePage={handlePageChange}
      />
    </div>
  );
}

export default BugList;
