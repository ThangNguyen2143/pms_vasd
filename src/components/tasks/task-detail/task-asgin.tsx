import { UserAssignsTask } from "~/lib/types";

// components/task-detail/task-assign.tsx
function TaskAssign({ assignTo }: { assignTo?: UserAssignsTask[] }) {
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
            {assignee.date_start ? (
              <p>Bắt đầu: {assignee.date_start}</p>
            ) : (
              <p>Người dùng chưa bắt đầu</p>
            )}
            {assignee.date_end ? <p>Kết thúc: {assignee.date_start}</p> : ""}
            <ul>
              <h4>Liên hệ:</h4>
              {assignee.contact.map((ct) => {
                return (
                  <li key={assignee.user_id + ct.code}>
                    <span className="italic">{ct.code}:</span>
                    {ct.value}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <div>Công việc chưa được giao cho ai</div>
      )}
    </div>
  );
}

export default TaskAssign;
