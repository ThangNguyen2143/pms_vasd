import { ProductModule, TaskDTO, WorkStatus } from "~/lib/types";
import TaskRow from "./task-row";
interface TaskListProps {
  product_id: string;
  modules: ProductModule[];
  taskList?: TaskDTO[];
  statusList: WorkStatus[];
  externalTaskCreated?: TaskDTO;
}
function TaskList({
  product_id,
  modules,
  taskList,
  statusList,
  externalTaskCreated,
}: TaskListProps) {
  const fullTaskList = taskList ? [...taskList] : [];
  if (
    externalTaskCreated &&
    !fullTaskList.find((t) => t.id === externalTaskCreated.id)
  ) {
    fullTaskList.push(externalTaskCreated);
  }
  const fieldTable = [
    { code: "id", display: "ID" },
    { code: "title", display: "Công việc" },
    { code: "module", display: "Module" },
    { code: "update", display: "Tình trạng" },
    { code: "create_at", display: "Ngày tạo" },
    { code: "dead_line", display: "Deadline" },
    { code: "status", display: "Trạng thái" },
    { code: "", display: "Thao tác" },
    { code: "check_update", display: "" },
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
          {fullTaskList.length > 0 ? (
            fullTaskList.map((task) => (
              <TaskRow
                task={task}
                statusList={statusList || []}
                modules={modules}
                key={task.id}
                product_id={product_id}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Chưa có công việc nào được tạo"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
