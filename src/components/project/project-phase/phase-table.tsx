"use client";
import { ProjectPhase, ProjectPhaseStatus, ProjectTimeLine } from "~/lib/types";
import DetailPhase from "./detail-phase";
import CreateTimelineForm from "../project-timeline/add-timeline-modal";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { useEffect, useState } from "react";
import TimelineDetailModal from "../project-timeline/detail-timeline-modal";
import { Info } from "lucide-react";

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
  const {
    getData: getListTimeLine,
    isLoading: isTimelineLoading,
    errorData: errorGet,
  } = useApi<ProjectTimeLine[]>();
  const [selectedTimeline, setSelectedTimeline] = useState<number | null>();
  const [showAddTimeLineForm, setShowAddTimeLineForm] = useState<
    Record<number, boolean>
  >({});
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
            className="card bg-base-100 shadow-md border border-base-300"
          >
            <div className="card-body">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="card-title text-xl font-bold">{phase.name}</h2>
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
                <div className="shrink-0">
                  <div className="drawer drawer-end">
                    <input
                      id={`detail-phase-drawer-${phase.id}`}
                      type="checkbox"
                      className="drawer-toggle"
                    />
                    <div className="drawer-content">
                      <label
                        htmlFor={`detail-phase-drawer-${phase.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Xem chi tiết
                      </label>
                    </div>
                    <div className="drawer-side z-40">
                      <label
                        htmlFor={`detail-phase-drawer-${phase.id}`}
                        aria-label="close sidebar"
                        className="drawer-overlay"
                      ></label>
                      <DetailPhase
                        phase_id={phase.id}
                        onUpdate={onUpdate}
                        project_id={project_id}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TODO: Hiển thị timeline dưới đây */}
              <div className="mt-4 border-t pt-4">
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
                <div className="space-y-2 mt-2">
                  {isTimelineLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Đang tải timeline...</span>
                      <span className="loading loading-dots loading-sm"></span>
                    </div>
                  ) : errorGet && errorGet.code !== 404 ? (
                    <div className="text-sm text-red-500">
                      Lỗi tải timeline: {errorGet.message}
                    </div>
                  ) : (listTimeLine[phase.id] || []).length === 0 ? (
                    <div className="text-sm text-gray-400 italic">
                      Chưa tạo timeline
                    </div>
                  ) : (
                    (listTimeLine[phase.id] || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-base-200 rounded border border-base-300"
                      >
                        <div className="p-2 ">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            {item.date_start} - {item.date_end} | Trọng số:{" "}
                            {item.weight}
                          </div>
                          <div className="text-sm">{item.status}</div>
                          {item.parent_id && (
                            <div className="text-sm italic">
                              Phụ thuộc:{" "}
                              {
                                listTimeLine[phase.id].find(
                                  (tl) => tl.id == item.parent_id
                                )?.name
                              }
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <button
                            className="tooltip btn btn-info"
                            data-tip="Chi tiết timeline"
                            onClick={() => setSelectedTimeline(item.id)}
                          >
                            <Info />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* <Timeline phaseId={phase.id} projectId={project_id} /> */}
              </div>
            </div>
          </div>
        ))}
      {selectedTimeline && (
        <TimelineDetailModal
          timeline_id={selectedTimeline}
          onClose={() => setSelectedTimeline(null)}
          onUpdate={updateTimeLineData}
        />
      )}
    </div>
  );
}

export default PhaseProjectTable;
