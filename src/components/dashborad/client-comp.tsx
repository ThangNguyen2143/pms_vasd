"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { GanttDTO, OverviewDTO, WorkOverviewDTO } from "~/lib/types";
import TotalOverviewTable from "./total-overview-table";
import StatusPieChartGroup from "./status-pie-chart-group";
import StaffTabs from "./staff-tab";
import GanttChart from "../ui/gantt-chart";
import { toast } from "sonner";
import ListProject from "../work-share/project-list-select";

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string;
  custom_class?: string; // dùng để tô màu nếu muốn
}
export function sortAndMapGanttData(data: GanttDTO[]): GanttTask[] {
  const phaseList = data.filter((item) => item.type === "phase");
  const timelineList = data.filter((item) => item.type === "timeline");

  const result: GanttTask[] = [];

  for (const phase of phaseList) {
    // Push phase task
    result.push({
      id: phase.id.toString(),
      name: phase.name,
      start: phase.start.split("T")[0],
      end: phase.end.split("T")[0],
      progress: statusToProgress(phase.status),
      custom_class: "gantt-phase",
    });

    // Find and attach related timelines
    const relatedTimelines = timelineList.filter((t) => t.parent === phase.id);
    for (const timeline of relatedTimelines) {
      result.push({
        id: timeline.id.toString() + "tl",
        name: timeline.name,
        start: timeline.start.split("T")[0],
        end: timeline.end.split("T")[0],
        progress: statusToProgress(timeline.status),
        dependencies: phase.id.toString(),
        custom_class: "gantt-timeline",
      });
    }
  }
  return result;
}

function statusToProgress(status: string): number {
  switch (status) {
    case "COMPLETED":
      return 100;
    case "INPROGRESS":
      return 50;
    case "PLANNED":
      return 0;
    case "FAILED":
      return 90;
    default:
      return 0;
  }
}

function ClientDashboardPage() {
  const [projectId, setProjectId] = useState<number>(0);
  const {
    data: overview,
    getData: getOverview,
    errorData: errorGetOverview,
  } = useApi<OverviewDTO>();

  const { data: workOverview, getData: getWorkOverview } =
    useApi<WorkOverviewDTO[]>();

  const { data: ganttData, getData: getGanttData } = useApi<GanttDTO[]>();
  useEffect(() => {
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setProjectId(parseInt(saved));
  }, []);
  useEffect(() => {
    if (projectId != 0) {
      sessionStorage.setItem("projectSelected", projectId.toString());

      getOverview(
        `/dashboard/${encodeBase64({
          type: "overview",
          project_id: projectId,
        })}`
      );
      getWorkOverview(
        `/dashboard/${encodeBase64({
          type: "assignment_summary",
          project_id: projectId,
        })}`
      );
      getGanttData(
        `/dashboard/${encodeBase64({
          type: "gantt_data",
          project_id: projectId,
        })}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);
  useEffect(() => {
    if (errorGetOverview) toast.error(errorGetOverview.message);
  }, [errorGetOverview]);
  return (
    <div className="p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Project Selector */}
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">TỔNG QUAN</h2>
        <ListProject
          projectSelected={projectId}
          setProjectSelect={setProjectId}
        />
      </div>

      {/* Gantt Chart */}
      <GanttChart tasks={sortAndMapGanttData(ganttData || [])} />

      {/* Overview Table */}
      {overview && <TotalOverviewTable data={overview} />}

      {/* Pie Charts */}
      {overview && <StatusPieChartGroup overview={overview} />}

      {/* Staff Tasks */}
      {workOverview && <StaffTabs data={workOverview} />}
    </div>
  );
}

export default ClientDashboardPage;
