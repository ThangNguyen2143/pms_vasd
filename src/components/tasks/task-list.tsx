import { encodeBase64 } from "~/lib/services";
import { TaskDTO, UserDto, WorkStatus } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { useEffect } from "react";
import TaskRow from "./task-row";
interface TaskListProps {
  product_id: string;
  externalTaskCreated?: TaskDTO;
}
function TaskList({ product_id, externalTaskCreated }: TaskListProps) {
  const endpoint = "/tasks/" + encodeBase64({ product_id });
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  const endpointStatus = "/system/config/eyJ0eXBlIjoidGFza19zdGF0dXMifQ==";

  const {
    data: taskList,
    getData: getTaskList,
    errorData,
  } = useApi<TaskDTO[]>();
  const { data: userList, getData: getUser } = useApi<UserDto[]>();
  const { data: statusList, getData: getStatus } = useApi<WorkStatus[]>();

  useEffect(() => {
    if (product_id != "") getTaskList(endpoint, "reload");
    getUser(endpointUser);
    getStatus(endpointStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);

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
    { code: "create_by", display: "Người tạo" },
    { code: "create_at", display: "Ngày tạo" },
    { code: "date_start", display: "Ngày bắt đầu" },
    { code: "dead_line", display: "Deadline" },
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
          {fullTaskList.length > 0 ? (
            fullTaskList.map((task) => (
              <TaskRow
                task={task}
                users={userList || []}
                statusList={statusList || []}
                key={task.id}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {errorData
                  ? errorData.message
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

export default TaskList;
