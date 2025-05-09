"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectDto } from "~/lib/type";

function LitsProject({
  project_id,
  setProjectId,
}: {
  project_id: number;
  setProjectId: (id: number) => void;
}) {
  const { data: projectList, getData, errorData } = useApi<ProjectDto[]>();
  const endpointProject = "/project/" + encodeBase64({ type: "all" });
  useEffect(() => {
    const fetchData = async () => {
      await getData(endpointProject, "reload");
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue !== "") {
      setProjectId(Number.parseInt(selectedValue));
    }
  };
  if (errorData)
    return (
      <div>
        <span className="alert alert-error">{errorData.message}</span>
      </div>
    );
  return (
    <select
      className="select select-ghost"
      onChange={handleChange}
      value={project_id}
    >
      <option disabled={true} value={0}>
        Chọn phần mềm
      </option>
      {projectList ? (
        projectList.map((item, index) => {
          return (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          );
        })
      ) : (
        <option>Đang tải...</option>
      )}
    </select>
  );
}

export default LitsProject;
