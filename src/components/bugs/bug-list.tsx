import { BugDto } from "~/lib/types";
import BugRow from "./bug-row";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
interface BugListProps {
  product_id: string;
  bugList?: BugDto[];
  onUpdateInProduct: (id: number[]) => void;
}
function BugList({ product_id, bugList, onUpdateInProduct }: BugListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const fullBugList = bugList ? [...bugList] : [];
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
  }, [searchParams, totalPages]);
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
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
    { code: "", display: "Thao tác" },
    { code: "update", display: "" },
  ];

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
                    <input type="checkbox" className="checkbox" />
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
                select={() => setSelectBug((pre) => [...pre, bug.bug_id])}
                unSelect={() =>
                  setSelectBug((pre) => pre.filter((t) => t != bug.bug_id))
                }
                bug={bug}
                product_id={product_id}
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
              <button
                className="btn btn-accent"
                onClick={() => onUpdateInProduct(selectBug)}
              >
                Cập nhật trong hệ thống
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="flex justify-center">
        {totalPages > 1 && (
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`join-item btn ${
                  page === currentPage ? "btn-active" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BugList;
