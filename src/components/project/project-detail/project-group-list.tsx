import { ProjectGroupContactDto } from "~/lib/types";

function ProjectGroupList({
  project_group,
}: {
  project_group?: ProjectGroupContactDto[];
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold text-primary border-b border-base-content/20 pb-2 mb-4">
        🔗 Liên hệ nhóm
      </h2>

      {project_group ? (
        <div className="space-y-3">
          {project_group.map((group, idx) => (
            <div
              key={idx}
              className="bg-base-100 p-3 rounded border-l-4 border-info"
            >
              <p className="font-semibold">{group.display}</p>
              <a
                href={group.value}
                className="text-blue-500 underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {group.value}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm text-gray-500">
          Không có liên hệ nhóm nào.
        </p>
      )}
    </div>
  );
}

export default ProjectGroupList;
