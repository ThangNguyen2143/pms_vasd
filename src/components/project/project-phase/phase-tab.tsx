/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectPhase, ProjectPhaseStatus } from "~/lib/types";
import AddPhaseProjectModal from "./add-phase-project";
import PhaseProjectTable from "./phase-table";

function PhaseTab({ project_id }: { project_id: number }) {
  // This component is a placeholder for the project phase tab.
  //fetch data status phase from API
  const {
    data: statusData,
    getData: getStatus,
    errorData: errorStatusGet,
  } = useApi<ProjectPhaseStatus[]>();
  //fetch data from API to get project phases
  const { data, getData: getPhases, errorData } = useApi<ProjectPhase[]>();
  const [showAddPhaseProject, setShowAddPhaseProject] = useState(false);
  useEffect(() => {
    const endpoint = `/project/phase/${encodeBase64({ project_id })}`;
    getStatus("/system/config/eyJ0eXBlIjoicGhhc2Vfc3RhdHVzIn0=", "default");
    getPhases(endpoint, "reload");
  }, []);
  const re = async () => {
    const endpoint = `/project/phase/${encodeBase64({ project_id })}`;
    await getPhases(endpoint, "reload");
  };
  useEffect(() => {
    if (errorStatusGet) {
      toast.warning(
        `Lỗi khi lấy trạng thái giai đoạn: ${errorStatusGet.message}`
      );
    }
  }, [errorStatusGet]);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Kế hoạch dự án</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddPhaseProject(true)}
        >
          + Thêm giai đoạn
        </button>
      </div>
      {data ? (
        <PhaseProjectTable
          data={data}
          onUpdate={re}
          project_id={project_id}
          statusData={statusData || undefined}
        />
      ) : errorData && errorData.code != 404 ? (
        <div>Chưa có dữ liệu</div>
      ) : (
        <div>
          <span className="alert alert-error">
            {errorData?.message || errorData?.title}
          </span>
        </div>
      )}
      {showAddPhaseProject && (
        <AddPhaseProjectModal
          onClose={() => setShowAddPhaseProject(false)}
          onUpdate={re}
          project_id={project_id}
        />
      )}
    </div>
  );
}

export default PhaseTab;
