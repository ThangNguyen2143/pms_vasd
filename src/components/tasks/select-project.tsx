"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectDto } from "~/lib/types";

function SelectProject() {
  const endpointProject = "/project/" + encodeBase64({ type: "all" });
  //   const dataProject = await fetchData<ProjectDto[]>({
  //     endpoint: endpointProject,
  //   });
  const { data: dataProject, getData, errorData } = useApi<ProjectDto[]>();
  useEffect(
    () => {
      getData(endpointProject, "reload");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (!dataProject) return <div className="alert alert-info">Đang tải...</div>;
  if (errorData?.code !== 200 && !dataProject) {
    return <div className="alert alert-error">{errorData?.message}</div>;
  }
  return (
    <div className="flex gap-2 ">
      {dataProject.map((project, index) => {
        return (
          <div
            key={index + 99}
            className="card card-border w-96 border border-base-300 bg-base-100 shadow-xl"
          >
            <Link
              href={`/tasks/${encodeBase64({
                project_id: project.id,
              })}`}
              className="card-body"
            >
              <h2 className="card-title">{project.name}</h2>
              <p>{project.description}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default SelectProject;
