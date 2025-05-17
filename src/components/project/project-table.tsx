/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectDto, ProjectStatus } from "~/lib/types";

function ProjectTable() {
  const endpointProject = "/project/" + encodeBase64({ type: "all" });
  const endpointStatus = "/system/config/eyJ0eXBlIjoicHJvamVjdF9zdGF0dXMifQ==";
  const {
    getData: getListProject,
    data: projectList,
    errorData: projectErrorData,
  } = useApi<ProjectDto[]>();
  const { data: statusList, getData: getStatus } = useApi<ProjectStatus[]>();
  useEffect(() => {
    async function fetchData() {
      await getListProject(endpointProject, "no-cache");
      await getStatus(endpointStatus);
    }
    fetchData();
  }, []);
  if (!projectList && !projectErrorData) {
    return <div className="text-center">Đang tải dữ liệu...</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên dự án</th>
            <th>Mô tả</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projectList ? (
            projectList.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.start_date}</td>
                  <td>{item.end_date}</td>
                  <td>
                    {statusList
                      ? statusList.find((st) => st.code == item.status)?.display
                      : item.status}
                  </td>
                  <td>
                    <Link
                      href={
                        "/projects/" + encodeBase64({ project_id: item.id })
                      }
                    >
                      <Pencil />
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>{projectErrorData?.message}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTable;
