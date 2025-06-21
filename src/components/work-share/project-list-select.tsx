"use client";
import { useEffect } from "react";
// import { useEffect } from "react";
// import { useApi } from "~/hooks/use-api";
// import { encodeBase64 } from "~/lib/services";
// import { ProjectDto } from "~/lib/types";
import { useProject } from "~/providers/project-context";

function ListProject({
  projectSelected,
  setProjectSelect,
}: {
  projectSelected: number;
  setProjectSelect: (projectSelect: number) => void;
}) {
  const projectContext = useProject();
  const projectList = projectContext?.projects;
  useEffect(() => {
    if (projectList && projectSelected == 0)
      setProjectSelect(projectList[0].id);
  }, [projectList, setProjectSelect, projectSelected]);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setProjectSelect(Number.parseInt(selectedValue));
  };
  if (projectContext?.isLoading)
    return (
      <span>
        Đang tải <span className="loading loading-spinner"></span>
      </span>
    );
  return (
    <select
      className="select select-ghost"
      onChange={handleChange}
      value={projectSelected}
    >
      <option disabled={true} value={0}>
        Chọn dự án
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
        <option disabled value={0}>
          Không có dữ liệu
        </option>
      )}
    </select>
  );
}

export default ListProject;
