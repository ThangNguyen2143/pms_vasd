import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import { TaskUnAcceptance } from "~/lib/types";

function UnapprovedList({ data }: { data: TaskUnAcceptance[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th className="text-center">Tổng tiêu chí</th>
            <th className="text-center">
              Số tiêu chí <br />
              Chưa chấp thuận
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr key={d.task_id}>
                <td>{d.task_id}</td>
                <td>{d.title}</td>
                <td>{d.status}</td>
                <td className="text-center">{d.total_criteria}</td>
                <td className="text-center">
                  <div className="tooltip">
                    <div className="tooltip-content">
                      <ul className="list">
                        {d.unapproved_criteria.map((un) => (
                          <li key={un.code + "" + d.task_id}>{un.title}</li>
                        ))}
                      </ul>
                    </div>
                    <span>{d.unapproved_count}</span>
                  </div>
                </td>
                <td>
                  <Link
                    href={"/task/" + encodeBase64({ task_id: d.task_id })}
                    className="btn btn-sm btn-secondary w-full"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không có task nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UnapprovedList;
