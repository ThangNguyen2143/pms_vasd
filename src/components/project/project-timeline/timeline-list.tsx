"use client";
import { Info } from "lucide-react";
import { useState } from "react";
import { ProjectTimeLine } from "~/lib/types";
import TimelineDetailModal from "./detail-timeline-modal";
interface TimelineListProps {
  timelines: ProjectTimeLine[];
  onUpdate: () => Promise<void>;
}
function TimelineList({ timelines, onUpdate }: TimelineListProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<number | null>(null);

  // Hàm để lấy các timeline con đệ quy
  const renderTimeline = (parent: ProjectTimeLine) => {
    // Tìm các timeline con của parent này
    const children = timelines.filter((tl) => tl.parent_id === parent.id);

    return (
      <div key={parent.id}>
        {/* Timeline Cha */}
        <div className="flex justify-between items-center bg-base-200 rounded border border-base-300">
          <div className="p-2">
            <div className="font-semibold">{parent.name}</div>
            <div className="text-sm text-gray-500">
              {parent.date_start} - {parent.date_end} | Trọng số:{" "}
              {parent.weight}
            </div>
            <div className="text-sm">{parent.status}</div>
          </div>
          <div className="p-2">
            <button
              className="tooltip btn btn-info"
              data-tip="Chi tiết timeline"
              onClick={() => setSelectedTimeline(parent.id)}
            >
              <Info />
            </button>
          </div>
        </div>

        {/* Các timeline con */}
        {children.length > 0 && (
          <div className="ml-4">
            {children.map((child) => renderTimeline(child))}{" "}
            {/* Đệ quy ở đây */}
          </div>
        )}
      </div>
    );
  };

  // Lọc ra các timeline cha (không có parent_id)
  const parentTimelines = timelines.filter((tl) => !tl.parent_id);

  return (
    <div className="space-y-2 mt-2">
      {parentTimelines.length ? (
        parentTimelines.map((parent) => renderTimeline(parent)) // Gọi hàm renderTimeline để hiển thị các timeline cha và con
      ) : (
        <div className="p-4 text-gray-500">
          Không có timeline nào cho giai đoạn này.
        </div>
      )}
      {selectedTimeline && (
        <TimelineDetailModal
          timeline_id={selectedTimeline}
          onClose={() => setSelectedTimeline(null)}
          onUpdate={onUpdate}
          timeLineList={timelines}
        />
      )}
    </div>
  );
}

export default TimelineList;
