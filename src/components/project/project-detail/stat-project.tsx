import { ProjectDetailDto, ProjectStatus } from "~/lib/types";

function displayStatus(code: string, statusList: ProjectStatus[]) {
  return statusList.find((status) => status.code == code)?.display;
}
function StatProject({
  project,
  statusList,
}: {
  project: ProjectDetailDto | null;
  statusList: ProjectStatus[] | null;
}) {
  if (!project)
    return <div className="bagde badge-error">Không có dữ liệu</div>;
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-8 w-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div className="stat-title">Tạo bởi</div>
        <div className="stat-value max-w-64 text-wrap">
          {project.project_log[0].name}
        </div>
        <div className="stat-desc">{project.create_at}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Thời gian bắt đầu</div>
        <div className="stat-value">{project.start_date}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Kết thúc dự kiến</div>
        <div className="stat-value">{project.end_date}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Trạng thái</div>
        <div className="stat-value">
          {statusList
            ? displayStatus(project.status, statusList)
            : "Không thể tải trạng thái"}
        </div>
        {project.actual_end_date && (
          <div className="stat-desc">Vào: {project.actual_end_date}</div>
        )}
      </div>
    </div>
  );
}

export default StatProject;
