import { OverviewDTO } from "~/lib/types";
import StatusPieChart from "./status-pie-chart";

type SummaryData = {
  [key: string]: number;
  total: number;
};
const requirementLabelMap: Record<string, string> = {
  new_request: "Mới tạo",
  clarify: "Cần làm rõ",
  accepted: "Chấp nhận",
  in_progress: "Đang xử lý",
  processed: "Đã xử lý",
  closed: "Đã hoàn thành",
  rejected: "Bị từ chối",
  canceled: "Bị hủy",
  failed: "Không thành công",
  unable_to_process: "Không thể thực hiện",
};

const taskLabelMap: Record<string, string> = {
  in_progress: "Đang thực hiện",
  done: "Đã hoàn thành",
  overdue: "Quá hạn",
  create: "Mới tạo",
  wait_update: "Chờ cập nhật",
};

const bugLabelMap: Record<string, string> = {
  open: "Đang mở",
  resolved: "Đã xử lý",
  rejected: "Đã từ chối",
  bugNew: "Mới tạo",
};

const testcaseLabelMap: Record<string, string> = {
  assigned: "Đã giao",
  done: "Hoàn tất",
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
        labelMap={requirementLabelMap}
      />
      <StatusPieChart
        title="Công việc"
        data={overview.task_summary as unknown as SummaryData}
        labelMap={taskLabelMap}
      />
      <StatusPieChart
        title="Bug"
        data={overview.bug_summary as unknown as SummaryData}
        labelMap={bugLabelMap}
      />
      <StatusPieChart
        title="Testcase"
        data={overview.testcase_summary as unknown as SummaryData}
        labelMap={testcaseLabelMap}
      />
    </div>
  );
}
