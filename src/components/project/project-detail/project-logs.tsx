import { ProjectLogDto } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

function ProjectLogs({ project_log }: { project_log?: ProjectLogDto[] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold text-primary border-b border-base-content/20 pb-2 mb-4">
        📜 Nhật ký hoạt động
      </h2>
      <div className="overflow-y-auto max-h-96">
        {project_log ? (
          <ul className="space-y-3 flex flex-col-reverse gap-2">
            {project_log.map((log) => (
              <li key={log.id + " " + log.date} className="flex items-start">
                <span className="mr-2">🕓</span>
                <div>
                  <strong>{format_date(log.date)}</strong> - <em>{log.name}</em>
                  :
                  <br />
                  {log.description}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có nhật ký hoạt động</p>
        )}
      </div>
    </div>
  );
}

export default ProjectLogs;
