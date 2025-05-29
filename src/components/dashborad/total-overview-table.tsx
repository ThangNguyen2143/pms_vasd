import { OverviewDTO } from "~/lib/types";

function TotalOverviewTable({ data }: { data: OverviewDTO }) {
  console.log(
    data.userRequirementSummary.total,
    data.task_summary.total,
    data.bug_summary.total,
    data.timeline_summary.total,
    data.testcase_summary.total
  );
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Yêu cầu</th>
            <th>Task</th>
            <th>Bug</th>
            <th>Timeline</th>
            <th>Testcase</th>
          </tr>
        </thead>

        <tbody>
          {data ? (
            <tr>
              <td>
                <b>Tổng</b>
              </td>
              <td>{data.userRequirementSummary.total}</td>
              <td>{data.task_summary.total}</td>
              <td>{data.bug_summary.total}</td>
              <td>{data.timeline_summary.total}</td>
              <td>{data.testcase_summary.total}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={6}>Chưa có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TotalOverviewTable;
