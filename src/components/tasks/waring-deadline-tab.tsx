import clsx from "clsx";
import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import { DeadlineWarning } from "~/lib/types";

function WarningDeadlineTab({ data }: { data: DeadlineWarning[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Người thực hiện</th>
            <th>Deadline</th>
            <th>Còn lại</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d, i) => (
              <tr key={d.id + "" + d.user_id + i}>
                <td>{d.id}</td>
                <td>{d.title}</td>
                <td>{d.status}</td>
                <td>{d.user_name}</td>
                <td>{d.deadline}</td>
                <td>
                  <span
                    className={clsx("badge", d.is_overdue ? "badge-error" : "")}
                  >
                    {d.hours_remaining}
                  </span>
                </td>
                <td>
                  <Link
                    href={"/task/" + encodeBase64({ task_id: d.id })}
                    className="btn btn-sm btn-secondary w-full"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không có task nào!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WarningDeadlineTab;
