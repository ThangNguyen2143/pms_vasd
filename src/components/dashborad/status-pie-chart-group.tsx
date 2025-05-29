import { OverviewDTO } from "~/lib/types";
import StatusPieChart from "./status-pie-chart";

type SummaryData = {
  [key: string]: number;
  total: number;
};
export default function StatusPieChartGroup({
  overview,
}: {
  overview: OverviewDTO;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatusPieChart
        title="Yêu cầu"
        data={overview.userRequirementSummary as unknown as SummaryData}
      />
      <StatusPieChart
        title="Công việc"
        data={overview.task_summary as unknown as SummaryData}
      />
      <StatusPieChart
        title="Bug"
        data={overview.bug_summary as unknown as SummaryData}
      />
      <StatusPieChart
        title="Testcase"
        data={overview.testcase_summary as unknown as SummaryData}
      />
    </div>
  );
}
