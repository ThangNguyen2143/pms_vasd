import { Plus } from "lucide-react";
import { useState } from "react";
import { ProjectGroupContactDto } from "~/lib/types";
import AddGroupContactModal from "./modals/add-group-modal";

function ProjectGroupList({
  project_id,
  project_group,
}: {
  project_id: number;
  project_group?: ProjectGroupContactDto[];
}) {
  const [showAddGroupContactModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <div className="flex justify-between text-primary border-b border-base-content/20 pb-2 mb-4">
        <h2 className="text-lg font-bold ">🔗 Nhóm liên hệ</h2>
        <button className="btn btn-ghost" onClick={() => setShowModal(true)}>
          <Plus />
        </button>
      </div>

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
      {showAddGroupContactModal && (
        <AddGroupContactModal
          project_id={project_id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ProjectGroupList;
