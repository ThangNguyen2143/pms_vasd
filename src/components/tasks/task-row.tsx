// components/task/task-row.tsx
import { Pencil } from "lucide-react";
import { TaskDTO, UserDto, WorkStatus } from "~/lib/types";

interface TaskRowProps {
  task: TaskDTO;
  users: UserDto[];
  statusList: WorkStatus[];
}

export default function TaskRow({ task, users, statusList }: TaskRowProps) {
  const creator = users.find((u) => u.userid === task.create_by);
  const statusDisplay = statusList.find((s) => s.code === task.status)?.display;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-2">{task.id}</td>
      <td className="px-4 py-2">{task.title}</td>
      <td className="px-4 py-2">
        {creator?.userData.display_name || "Không rõ"}
      </td>
      <td className="px-4 py-2">{task.create_at}</td>
      <td className="px-4 py-2">{task.date_start}</td>
      <td className="px-4 py-2">{task.dead_line}</td>
      <td className="px-4 py-2">
        <span className="badge">{statusDisplay || "Không rõ"}</span>
      </td>
      <td className="px-4 py-2">
        {/* Có thể thêm nút sửa/xoá ở đây */}
        <button className="btn btn-sm btn-secondary">
          <Pencil />
        </button>
      </td>
    </tr>
  );
}
