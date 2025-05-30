/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectDto } from "~/lib/types";

function ListProject({
  projectSelected,
  setProjectSelect,
}: {
  projectSelected: number;
  setProjectSelect: (projectSelect: number) => void;
}) {
  const { data: projectList, getData, errorData } = useApi<ProjectDto[]>();
  const endpointProject = "/system/config/" + encodeBase64({ type: "project" });
  useEffect(() => {
    const fetchData = async () => {
      await getData(endpointProject, "no-cache");
    };
    fetchData();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setProjectSelect(Number.parseInt(selectedValue));
  };
  if (errorData) {
    if (errorData.code == 404)
      return (
        <div>
          <span className="alert alert-info">
            Bạn chưa được phân vào bất kì dự án nào
          </span>
        </div>
      );
    if (errorData.code == 500)
      return (
        <div>
          <span className="alert alert-error">Lỗi server</span>
        </div>
      );
    return (
      <div>
        <span className="alert alert-error">{errorData.message}</span>
      </div>
    );
  }
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
          if (projectList.length == 1)
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
