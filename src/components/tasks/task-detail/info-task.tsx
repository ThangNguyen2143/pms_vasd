// components/task-detail/task-info.tsx
import clsx from "clsx";
import { Task } from "~/lib/types";
import { status_with_color } from "~/utils/status-with-color";

function TaskInfo({ task }: { task: Task }) {
  return (
    <div className="space-y-2">
      <div className="indicator">
        <span
          className={clsx(
            "indicator-item badge",
            `badge-${status_with_color(task.status)}`
          )}
        >
          {task.status_name}
        </span>
        <h3 className="text-xl font-semibold">{task.title}</h3>
      </div>
      <p>{task.description}</p>
      <div className="text-sm text-gray-500">
        <p>Người tạo: {task.create_by}</p>
        <p>Ngày tạo: {task.create_at}</p>
        <p>Ngày bắt đầu: {task.date_start || "Chưa có"}</p>
        <p>Hạn chót: {task.dead_line}</p>
        <p>Ngày kết thúc: {task.date_end || "Chưa có"}</p>
        <p>Cập nhật: {task.is_update ? "Đã cập nhật" : "Chưa cập nhật"}</p>
        <p>Trạng thái: {task.status_name}</p>
      </div>
    </div>
  );
}

export default TaskInfo;
