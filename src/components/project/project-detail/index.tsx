"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectDetailDto, ProjectRole, ProjectStatus } from "~/lib/types";
import ProjectLogs from "./project-logs";
import StatProject from "./stat-project";
import StakeholderList from "./stakeholder-list";
import ProjectMemberList from "./project-member-list";
import ProjectGroupList from "./project-group-list";

function MainDisplayOnProject({ project_id }: { project_id: number }) {
  const endpointStatus = "/system/config/eyJ0eXBlIjoicHJvamVjdF9zdGF0dXMifQ==";
  const enpointRoles = "/system/config/eyJ0eXBlIjoicHJvamVjdF9yb2xlIn0=";
  const { data, getData: getProject, errorData } = useApi<ProjectDetailDto>();
  const { data: statusList, getData: getStatus } = useApi<ProjectStatus[]>();
  const { data: roleInProject, getData: getRoleList } = useApi<ProjectRole[]>();

  useEffect(() => {
    const endpoint = "/project/detail/" + encodeBase64({ project_id });
    getProject(endpoint, "reload");
    getStatus(endpointStatus);
    getRoleList(enpointRoles);
  }, []);
  if (!data) {
    if (!errorData) return <div>Đang tải dữ liệu...</div>;
    else return <div>{errorData.message}</div>;
  }
  if (roleInProject) {
    if (data.project_members.length > 0)
      data.project_members.forEach((member) => {
        member.role.forEach((role) => {
          const roleFullInfor = roleInProject.find((r) => r.code == role.code);
          role.description = roleFullInfor?.description;
          role.display = roleFullInfor?.display;
        });
      });
  }
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dự án: {data.name}</h1>
      <p className="text-lg">{data.description}</p>
      <StatProject project={data} statusList={statusList} />
      <div className="flex max-h-96 flex-col md:flex-row">
        <div className="flex-1/2">
          <p className="text-lg">Dòng thời gian</p>
          <ProjectLogs project_log={data.project_log} />
        </div>
        <div className="flex-1/2">
          <p className="text-lg">Danh sách các bên liên quan</p>
          <StakeholderList stakeholder={data.project_stakeholders} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="card rounded-box grow ">
          <h2 className="text-2xl">Danh sách thành viên dự án</h2>
          <ProjectMemberList
            project_member={data.project_members}
            project_id={data.id}
          />
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="card rounded-box grow ">
          <h2 className="text-2xl">Danh sách nhóm liên hệ</h2>
          <ProjectGroupList
            project_group={data.project_group_contacts}
          ></ProjectGroupList>
        </div>
      </div>
    </div>
  );
}

export default MainDisplayOnProject;
