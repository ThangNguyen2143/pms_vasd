import { ProjectGroupContactDto } from "~/lib/types";

function ProjectGroupList({
  project_group,
}: {
  project_group?: ProjectGroupContactDto[];
}) {
  return (
    <div>
      <button className="btn btn-primary">Tạo nhóm liên hệ</button>
      <div>
        {!project_group || project_group.length == 0 ? (
          <div className="badge badge-info">Không có dữ liệu</div>
        ) : (
          <>
            <ol className="list">
              {project_group.map((group, i) => (
                <li key={group.type}>
                  {i + 1}:{" " + group.display}
                </li>
              ))}
            </ol>
            <span className="text-accent text-right">
              Tổng cộng: {project_group.length} nhóm
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectGroupList;
