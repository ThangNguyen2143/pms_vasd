"use client";
import { useRouter } from "next/navigation";
import { encodeBase64 } from "~/lib/services";
import { ProductModule, TaskDTO, WorkStatus } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

interface TaskRowProps {
  task: TaskDTO;
  modules: ProductModule[];
  statusList: WorkStatus[];
  product_id: string;
  isSelected?: boolean;
  setSelect?: (id: number, isSelected: boolean) => void;
}

export default function TaskRow({
  task,
  statusList,
  modules,
  isSelected,
  setSelect,
}: TaskRowProps) {
  const router = useRouter();
  const statusDisplay = statusList.find((s) => s.code === task.status)?.display;
  const moduleDisplay = task.module
    ? modules.find((m) => m.id == task.module)?.display
    : undefined;
  const handleClickRow = (task: TaskDTO) => {
    router.push("/task/" + encodeBase64({ task_id: task.id }));
  };
  return (
    <tr
      className="hover:bg-base-300 dark:hover:bg-gray-700"
      onClick={() => handleClickRow(task)}
    >
      <td className="px-4 py-2">{task.id}</td>
      <td className="px-4 py-2 max-w-72 truncate">{task.title}</td>
      <td className="px-4 py-2 max-w-32 truncate">{moduleDisplay || "-"}</td>
      <td className="px-4 py-2">
        {task.is_update ? "Đã cập nhật" : "Chưa cập nhật"}
      </td>
      <td className="px-4 py-2">{format_date(task.create_at)}</td>
      <td className="px-4 py-2">{format_date(task.dead_line)}</td>
      <td className="px-4 py-2">
        <span className="badge">{statusDisplay || "Không rõ"}</span>
      </td>
      <td className="py-2 px-4">
        {task.is_update ? (
          <input
            type="checkbox"
            defaultChecked
            disabled
            className="checkbox checkbox-success"
          />
        ) : (
          <label>
            <input
              type="checkbox"
              className="checkbox"
              checked={isSelected || false}
              onChange={(e) => {
                if (!setSelect) return;
                if (e.target.checked) setSelect(task.id, true);
                else setSelect(task.id, false);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </label>
        )}
      </td>
    </tr>
  );
}
