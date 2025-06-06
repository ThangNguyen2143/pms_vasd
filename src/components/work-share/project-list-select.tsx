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
    if (projectList) setProjectSelect(projectList[0].id);
  }, [projectList, setProjectSelect]);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setProjectSelect(Number.parseInt(selectedValue));
  };
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
          if (projectList.length === 1)
            return (
              <option key={index} value={item.id} defaultChecked>
                {item.name}
              </option>
            );
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

export default ListProject;
