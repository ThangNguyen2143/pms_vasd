"use client";
import { ProjectPhase, ProjectPhaseStatus, ProjectTimeLine } from "~/lib/types";
import DetailPhase from "./detail-phase";
import CreateTimelineForm from "../project-timeline/add-timeline-modal";
import { useEffect, useState } from "react";
import TimelineList from "../project-timeline/timeline-list";
import { encodeBase64 } from "~/lib/services";
import { useApi } from "~/hooks/use-api";

function PhaseProjectTable({
  data,
  statusData,
  project_id,
  onUpdate,
}: {
  data: ProjectPhase[];
  statusData?: ProjectPhaseStatus[];
  project_id: number;
  onUpdate: () => Promise<void>;
}) {
  const [showAddTimeLineForm, setShowAddTimeLineForm] = useState<
    Record<number, boolean>
  >({});
  const {
    getData: getListTimeLine,
    isLoading: isTimelineLoading,
    errorData: errorGet,
  } = useApi<ProjectTimeLine[]>();
  const [listTimeLine, setListTimeLine] = useState<
    Record<number, ProjectTimeLine[]>
  >({});
  useEffect(() => {
    data.forEach((phase) => {
      updateTimeLineData(phase.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const updateTimeLineData = async (phase_id: number) => {
    const encoded = encodeBase64({ phase_id, project_id });
    const re = await getListTimeLine(`/project/timeline/${encoded}`);

    if (re) {
      setListTimeLine((prev) => ({ ...prev, [phase_id]: re }));
    } else if (errorGet && errorGet.code === 404) {
      setListTimeLine((prev) => ({ ...prev, [phase_id]: [] }));
    }
  };

  const toggleForm = (phase_id: number) => {
    setShowAddTimeLineForm((prev) => ({
      ...prev,
      [phase_id]: !prev[phase_id],
    }));
  };
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...data]
        .sort(
          (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        )
        .map((phase) => (
          <div
            key={phase.id}
            className="bg-base-100 shadow-md border border-base-300 flex flex-row"
          >
            <div className="collapse w-full">
              <input
                type="checkbox"
                id={phase.id + "phase-col"}
                defaultChecked
              />
              <div className="flex flex-col gap-4 justify-between collapse-title">
                <div className="grow">
                  <h2 className="card-title text-xl font-bold">{phase.name}</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <p className="text-sm text-gray-500">
                    {new Date(phase.start_date).toLocaleDateString()} -{" "}
                    {new Date(phase.end_date).toLocaleDateString()} ({" "}
                    {(
                      (new Date(phase.end_date).getTime() -
                        new Date(phase.start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                    ).toFixed(0)}{" "}
                    ngày)
                  </p>
                  <p className="text-sm mt-1">
                    Trạng thái:{" "}
                    {statusData
                      ? statusData.find(
                          (status) => status.code === phase.status
                        )?.display || "Chưa xác định"
                      : phase.status || "Chưa xác định"}
                  </p>
                </div>
              </div>

              {/* TODO: Hiển thị timeline dưới đây */}
              <div className="collapse-content mt-4 border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold">Timeline công việc:</p>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => toggleForm(phase.id)}
                  >
                    {showAddTimeLineForm?.[phase.id]
                      ? "Đóng"
                      : "+ Tạo timeline"}
                  </button>
                </div>
                {showAddTimeLineForm?.[phase.id] && (
                  <CreateTimelineForm
                    projectId={project_id}
                    phaseId={phase.id}
                    onUpdate={() => updateTimeLineData(phase.id)}
                    timelineList={listTimeLine[phase.id]}
                  />
                )}
                {/* Chèn component timeline tại đây */}
                {isTimelineLoading ? (
                  <span className="loading loading-ball"></span>
                ) : (
                  <TimelineList
                    onUpdate={() => updateTimeLineData(phase.id)}
                    timelines={listTimeLine[phase.id] || []}
                  />
                )}

                {/* <Timeline phaseId={phase.id} projectId={project_id} /> */}
              </div>
            </div>
            <div className="drawer drawer-end z-50 w-24">
              <input
                id={`detail-phase-drawer-${phase.id}`}
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content">
                <div className="flex justify-end p-4 w-fit">
                  <label
                    htmlFor={`detail-phase-drawer-${phase.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Xem chi tiết
                  </label>
                </div>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor={`detail-phase-drawer-${phase.id}`}
                  className="drawer-overlay"
                />
                <DetailPhase
                  phase_id={phase.id}
                  onUpdate={onUpdate}
                  project_id={project_id}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default PhaseProjectTable;
