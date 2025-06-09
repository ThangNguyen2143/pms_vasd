import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import { TaskDTO, WorkStatus } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

interface TaskRowProps {
  task: TaskDTO;
  statusList: WorkStatus[];
  product_id: string;
}

export default function TaskRow({
  task,
  statusList,
  product_id,
}: TaskRowProps) {
  const statusDisplay = statusList.find((s) => s.code === task.status)?.display;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-2">{task.id}</td>
      <td className="px-4 py-2">{task.title}</td>
      <td className="px-4 py-2">
        {task.is_update ? "Đã cập nhật" : "Chưa cập nhật"}
      </td>
      <td className="px-4 py-2">{format_date(task.create_at)}</td>
      <td className="px-4 py-2">
        {task.date_start ? format_date(task.date_start) : "-"}
      </td>
      <td className="px-4 py-2">{format_date(task.dead_line)}</td>
      <td className="px-4 py-2">
        <span className="badge">{statusDisplay || "Không rõ"}</span>
      </td>
      <td className="px-4 py-2">
        {/* Có thể thêm nút sửa/xoá ở đây */}
        <Link
          href={"/task/" + encodeBase64({ task_id: task.id, product_id })}
          className="btn btn-sm btn-secondary"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}
