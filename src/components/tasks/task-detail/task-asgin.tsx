"use client";

import { UserAssignsTask } from "~/lib/types";

function TaskAssign({
  assignTo,
}: {
  assignTo?: UserAssignsTask[];
  task_id: number;
  onUpdate: () => Promise<void>;
}) {
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-primary mb-2">
        👥 Người được giao
      </h3>
      {assignTo ? (
        assignTo.map((assignee) => (
          <div
            className="bg-base-100 p-3 rounded-lg border-l-4 border-info"
            key={assignee.user_id}
          >
            <p>
              <strong>{assignee.name}</strong>
            </p>
            <p>Ngày giao: {assignee.date_assign}</p>
            <p>Deadline: {assignee.cur_deadLine}</p>
            {assignee.date_start ? (
              <p>Bắt đầu: {assignee.date_start}</p>
            ) : (
              <p>Người dùng chưa bắt đầu</p>
            )}
            {assignee.date_end ? <p>Kết thúc: {assignee.date_end}</p> : ""}
          </div>
        ))
      ) : (
        <div>Công việc chưa được giao cho ai</div>
      )}
    </div>
  );
}

export default TaskAssign;
