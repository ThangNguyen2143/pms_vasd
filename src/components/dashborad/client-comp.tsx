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
// import TotalOverviewTable from "./total-overview-table";
import StatusPieChartGroup from "./status-pie-chart-group";
import StaffTabs from "./staff-tab";
// import GanttChart from "../ui/gantt-chart";
import { toast } from "sonner";
import ListProject from "../work-share/project-list-select";
import StaffTreeView from "./tab-tree-view";
import GanttWrapper from "./gantt-wrrapper";
import { Search } from "lucide-react";
import SearchGlobalModal from "./modals/search-global-modal";
// import ScheduleDashboard from "./schedule";

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string;
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
        start: phase.start,
        end: phase.end,
        progress: progressItem?.progress_percent || 0,
      });

      // Find and attach related timelines
      const relatedTimelines = timelineList.filter(
        (t) => t.phase_id === phase.id
      );
      for (const timeline of relatedTimelines) {
        result.push({
          id: timeline.id.toString() + "tl",
          name: timeline.name,
          start: timeline.start,
          end: timeline.end,
          progress: statusToProgress(timeline.status),
          dependencies: timeline.parent?.toString() + "tl",
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
  const [showSearchModal, setShowSearchModal] = useState(false);
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
        })}`,
        "no-cache"
      );
      getWorkOverview(
        `/dashboard/${encodeBase64({
          type: "assignment_summary",
          project_id: projectId,
        })}`,
        "no-cache"
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
        <div>
          <button
            className="btn btn-circle btn-outline m-2 tooltip"
            data-tip="Tìm kiếm chung"
            onClick={() => setShowSearchModal(true)}
          >
            <Search />
          </button>
          <ListProject
            projectSelected={projectId}
            setProjectSelect={setProjectId}
          />
        </div>
      </div>

      {/* Gantt Chart */}
      {overview && ganttData && (
        <div className="rounded shadow max-h-[500px]">
          <GanttWrapper
            tasks={sortAndMapGanttData(
              ganttData || [],
              overview.progress_percent
            )}
            project_start={overview.start_date}
            project_end={overview.end_date}
          />
        </div>
      )}

      {/* name of each tab group should be unique */}
      {/* <div className="tabs tabs-border">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Tổng quan"
          defaultChecked
        />
        <div className="tab-content">
         
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Lịch trực"
        />
        <div className="tab-content">
          <ScheduleDashboard />
        </div>
      </div> */}

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
      {showSearchModal && (
        <SearchGlobalModal onClose={() => setShowSearchModal(false)} />
      )}
    </div>
  );
}

export default ClientDashboardPage;
