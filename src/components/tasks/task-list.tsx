import { ProductModule, TaskDTO, WorkStatus } from "~/lib/types";
import TaskRow from "./task-row";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PagingComponent from "../ui/paging-table";
interface TaskListProps {
  product_id: string;
  modules: ProductModule[];
  taskList?: TaskDTO[];
  statusList: WorkStatus[];
  onUpdateInProduct: (id: number[]) => void;
}
function TaskList({
  product_id,
  modules,
  taskList,
  statusList,
  onUpdateInProduct,
}: TaskListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectTask, setSelectTask] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const fullTaskList = taskList
    ? [...taskList.sort((a, b) => b.id - a.id)]
    : [];
  const totalPages = Math.ceil(fullTaskList.length / 10);
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
  const currentTasks = fullTaskList.slice(startIndex, startIndex + 10);
  const fieldTable = [
    { code: "id", display: "ID" },
    { code: "title", display: "Công việc" },
    { code: "module", display: "Module" },
    { code: "update", display: "Tình trạng" },
    { code: "create_at", display: "Ngày tạo" },
    { code: "dead_line", display: "Deadline" },
    { code: "status", display: "Trạng thái" },
    { code: "check_update", display: "" },
  ];
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectTask(
        currentTasks.filter((task) => !task.is_update).map((task) => task.id)
      );
    } else {
      setSelectTask([]);
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
                        selectTask.length ===
                          currentTasks.filter((task) => !task.is_update)
                            .length && currentTasks.length > 0
                      }
                    />
                  </label>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <TaskRow
                task={task}
                statusList={statusList || []}
                modules={modules}
                isSelected={selectTask.includes(task.id)}
                setSelect={(id: number, isSelected: boolean) => {
                  if (isSelected) {
                    setSelectTask((pre) => [...pre, id]);
                  } else {
                    setSelectTask((pre) => pre.filter((t) => t != id));
                  }
                }}
                key={task.id}
                product_id={product_id}
              />
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-4">
                {product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Chưa có công việc nào được tạo"}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={9} className="text-end">
              {selectTask.length > 0 && (
                <button
                  className="btn btn-accent"
                  onClick={() => onUpdateInProduct(selectTask)}
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

export default TaskList;
