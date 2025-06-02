"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import {
  GanttDTO,
  OverviewDTO,
  progressPercent,
  WorkOverviewDTO,
} from "~/lib/types";
import TotalOverviewTable from "./total-overview-table";
import StatusPieChartGroup from "./status-pie-chart-group";
import StaffTabs from "./staff-tab";
import GanttChart from "../ui/gantt-chart";
import { toast } from "sonner";
import ListProject from "../work-share/project-list-select";
import StaffTreeView from "./tab-tree-view";

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string;
  custom_class?: string; // dùng để tô màu nếu muốn
}
export function sortAndMapGanttData(
  data: GanttDTO[],
  progress_percent_raw: progressPercent[]
): GanttTask[] {
  const progress_percent = Array.isArray(progress_percent_raw)
    ? progress_percent_raw
    : [];
  const phaseList = data
    .filter((item) => item.type === "phase")
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const timelineList = data
    .filter((item) => item.type === "timeline")
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const result: GanttTask[] = [];

  for (const phase of phaseList) {
    // Push phase task
    if (phase.status != "PLANNED") {
      const progressItem = progress_percent.find(
        (pp) => pp.phase_id === phase.id
      );
      result.push({
        id: phase.id.toString(),
        name: phase.name,
        start: phase.start.split("T")[0],
        end: phase.end.split("T")[0],
        progress: progressItem?.progress_percent || 0,
        custom_class: "gantt-phase",
      });

      // Find and attach related timelines
      const relatedTimelines = timelineList.filter(
        (t) => t.phase_id === phase.id
      );
      for (const timeline of relatedTimelines) {
        result.push({
          id: timeline.id.toString() + "tl",
          name: timeline.name,
          start: timeline.start.split("T")[0],
          end: timeline.end.split("T")[0],
          progress: statusToProgress(timeline.status),
          dependencies: timeline.parent?.toString() + "tl",
          custom_class: "gantt-timeline",
        });
      }
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
  // useEffect(() => {
  //   if (!overview) return;
  //   const getGanttStartDate = (data: GanttDTO[]): Date => {
  //     const allDates = data.map((item) => new Date(item.start));
  //     return new Date(Math.min(...allDates.map((d) => +d)));
  //   };

  //   const scrollToPhaseStart = () => {
  //     const ganttContainer = document.querySelector(
  //       ".gantt-container"
  //     ) as HTMLElement;
  //     if (!ganttContainer || !ganttData || ganttData.length === 0) return;

  //     const chartStartDate = getGanttStartDate(ganttData);
  //     const firstPhaseStart = new Date(overview.progress_percent[0].start_date);
  //     const dayDiff = Math.floor(
  //       (+firstPhaseStart - +chartStartDate) / (1000 * 60 * 60 * 24)
  //     );

  //     const stepWidth = 45; // đúng với style: --gv-column-width
  //     const offset = Math.max(
  //       0,
  //       dayDiff * stepWidth - ganttContainer.clientWidth / 2
  //     );

  //     ganttContainer.scrollTo({ left: offset, behavior: "smooth" });
  //     console.log("Chart Start:", chartStartDate);
  //     console.log("Phase Start:", firstPhaseStart);
  //     console.log("Offset to scroll:", offset);
  //   };

  //   if (!overview || !ganttData?.length) return;
  //   setTimeout(scrollToPhaseStart, 300);
  // }, [overview, ganttData]);

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
      {overview && (
        <div className="border rounded shadow max-h-[500px]">
          <GanttChart
            tasks={sortAndMapGanttData(
              ganttData || [],
              overview.progress_percent
            )}
          />
        </div>
      )}
      {/* Overview Table */}
      {overview && <TotalOverviewTable data={overview} />}

      {/* Pie Charts */}
      {overview && <StatusPieChartGroup overview={overview} />}

      {/* Staff Tasks */}
      {workOverview ? (
        workOverview.length > 1 ? (
          <StaffTreeView data={workOverview} />
        ) : (
          <StaffTabs data={workOverview} />
        )
      ) : undefined}
    </div>
  );
}

export default ClientDashboardPage;
