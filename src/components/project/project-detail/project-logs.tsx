import { CircleSmall } from "lucide-react";
import { ProjectLogDto } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

function ProjectLogs({ project_log }: { project_log?: ProjectLogDto[] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold text-primary border-b border-base-content/20 pb-2 mb-4">
        📜 Nhật ký hoạt động
      </h2>
      <div className="overflow-y-auto max-h-96">
        <ul className="timeline timeline-vertical flex-col-reverse">
          {project_log ? (
            project_log.map((log) => {
              return (
                <li key={log.date + "log"}>
                  <div className="timeline-start">{format_date(log.date)}</div>
                  <div className="timeline-middle">
                    <CircleSmall />
                  </div>
                  <div className="timeline-end timeline-box text-sm text-center max-w-xs">
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip={`Người thực hiện: ${log.name}`}
                    >
                      <span>{log.description}</span>
                    </div>
                  </div>
                  <hr />
                </li>
              );
            })
          ) : (
            <li>Chưa có dữ liệu</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ProjectLogs;
