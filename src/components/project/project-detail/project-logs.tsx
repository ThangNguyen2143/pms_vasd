import { CircleSmall } from "lucide-react";
import { ProjectLogDto } from "~/lib/types";

function ProjectLogs({ project_log }: { project_log?: ProjectLogDto[] }) {
  return (
    <div className="overflow-y-auto">
      <ul className="timeline timeline-vertical">
        {project_log ? (
          project_log.map((log) => {
            return (
              <li key={log.date + "log"}>
                <div className="timeline-start">{log.date}</div>
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
  );
}

export default ProjectLogs;
