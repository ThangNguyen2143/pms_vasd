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
  delay: "Thực hiện sau",
};

const taskLabelMap: Record<string, string> = {
  in_progress: "Đang thực hiện",
  done: "Đã hoàn thành",
  assigned: "Đã giao",
  // overdue: "Quá hạn",
  create: "Mới tạo",
  // wait_update: "Chờ cập nhật",
};

const bugLabelMap: Record<string, string> = {
  open: "Đang mở",
  resolved: "Đã xử lý",
  closed: "Đã đóng",
  retesting: "Đang kiểm lại",
  rejected: "Đã từ chối",
  bugNew: "Mới tạo",
  inprogress: "Đang thực hiện",
};

const testcaseLabelMap: Record<string, string> = {
  assigned: "Đã giao",
  draft: "Mới tạo",
  done: "Hoàn tất",
};
const requirementLabelColor: Record<string, string> = {
  new_request: "#ec4899",
  clarify: "#22d3ee",
  accepted: "#60a5fa",
  closed: "#4ade80",
  rejected: "#a78bfa",
  canceled: "#f97316",
  unable_to_process: "#34d399",
  failed: "#f87171",
  delay: "#10b981",
};

const taskLabelColor: Record<string, string> = {
  in_progress: "#ec4899",
  done: "#4ade80",
  assigned: "#60a5fa",
  // overdue: "Quá hạn",
  create: "#ec4899",
  // wait_update: "Chờ cập nhật",
};

const bugLabelColor: Record<string, string> = {
  open: "#22d3ee",
  resolved: "#818cf8",
  closed: "#4ade80",
  retesting: "#10b981",
  rejected: "#f87171",
  bugNew: "#ec4899",
  inprogress: "#60a5fa",
};

const testcaseLabelColor: Record<string, string> = {
  assigned: "#60a5fa",
  draft: "#ec4899",
  done: "#4ade80",
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
        colorMap={requirementLabelColor}
      />
      <StatusPieChart
        title="Công việc"
        data={overview.task_summary as unknown as SummaryData}
        labelMap={taskLabelMap}
        colorMap={taskLabelColor}
      />
      <StatusPieChart
        title="Bug"
        data={overview.bug_summary as unknown as SummaryData}
        labelMap={bugLabelMap}
        colorMap={bugLabelColor}
      />
      <StatusPieChart
        title="Testcase"
        data={overview.testcase_summary as unknown as SummaryData}
        labelMap={testcaseLabelMap}
        colorMap={testcaseLabelColor}
      />
    </div>
  );
}
