import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import { ProductModule, TaskDTO, WorkStatus } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

interface TaskRowProps {
  task: TaskDTO;
  modules: ProductModule[];
  statusList: WorkStatus[];
  product_id: string;
  select: () => void;
  unSelect: () => void;
}

export default function TaskRow({
  task,
  statusList,
  modules,
  select,
  unSelect,
}: TaskRowProps) {
  const statusDisplay = statusList.find((s) => s.code === task.status)?.display;
  const moduleDisplay = task.module
    ? modules.find((m) => m.id == task.module)?.display
    : undefined;
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-2">{task.id}</td>
      <td className="px-4 py-2 max-w-64 truncate">{task.title}</td>
      <td className="px-4 py-2 max-w-32 truncate">{moduleDisplay || "-"}</td>
      <td className="px-4 py-2">
        {task.is_update ? "Đã cập nhật" : "Chưa cập nhật"}
      </td>
      <td className="px-4 py-2">{format_date(task.create_at)}</td>
      <td className="px-4 py-2">{format_date(task.dead_line)}</td>
      <td className="px-4 py-2">
        <span className="badge">{statusDisplay || "Không rõ"}</span>
      </td>
      <td className="py-2">
        <div className="flex gap-1">
          <Link
            href={"/task/" + encodeBase64({ task_id: task.id })}
            className="btn btn-sm btn-secondary w-full"
          >
            Chi tiết
          </Link>
        </div>
      </td>
      <td className="py-2 px-4">
        <label>
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => {
              if (e.target.checked) select();
              else unSelect();
            }}
          />
        </label>
      </td>
    </tr>
  );
}
