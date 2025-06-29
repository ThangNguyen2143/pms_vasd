"use client";
import { ProjectDetailDto, ProjectRole, ProjectStatus } from "~/lib/types";
import ProjectGroupList from "./project-group-list";
import ProjectInfo from "./project-info";
import ProjectLogs from "./project-logs";
import ProjectMemberList from "./project-member-list";
import StakeholderList from "./stakeholder-list";
import { useApi } from "~/hooks/use-api";
import { useEffect } from "react";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";

function ProjectBase({ project_id }: { project_id: number }) {
  const endpointStatus = "/system/config/eyJ0eXBlIjoicHJvamVjdF9zdGF0dXMifQ==";
  const enpointRoles = "/system/config/eyJ0eXBlIjoicHJvamVjdF9yb2xlIn0=";
  const { data, getData: getProject, errorData } = useApi<ProjectDetailDto>();
  const {
    data: statusList,
    getData: getStatus,
    errorData: errorStatus,
  } = useApi<ProjectStatus[]>();
  const {
    data: roleInProject,
    getData: getRoleList,
    errorData: roleError,
  } = useApi<ProjectRole[]>();

  useEffect(() => {
    const endpoint = "/project/detail/" + encodeBase64({ project_id });
    getProject(endpoint, "reload");
    getStatus(endpointStatus);
    getRoleList(enpointRoles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchDataProject = async () => {
    const endpoint = "/project/detail/" + encodeBase64({ project_id });
    getProject(endpoint, "reload");
  };
  if (!data) {
    if (!errorData) return <div className="p-6">Đang tải dữ liệu...</div>;
    else return <div className="p-6 text-error">{errorData.message}</div>;
  }

  if (roleError) toast.error(roleError.message);
  if (errorStatus) toast.error(errorStatus.message);

  // Mapping display role
  if (roleInProject && data.project_members.length > 0) {
    data.project_members = data.project_members.map((member) => {
      const roleWithDisplay = member.role.map((role) => {
        const roleInfo = roleInProject.find((r) => r.code === role.role_code);

        return {
          role_code: role.role_code,
          display: roleInfo?.display,
          description: roleInfo?.description,
        };
      });

      return {
        ...member,
        role: roleWithDisplay,
      };
    });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
      {/* Left column (2/3 width) */}
      <div className="md:col-span-2 flex flex-col gap-6">
        <ProjectInfo
          info={data}
          statusList={statusList}
          onUpdate={async () => await fetchDataProject()}
        />
        <ProjectLogs project_log={data.project_log} />
        <ProjectGroupList
          onUpdate={async () => await fetchDataProject()}
          project_id={data.id}
          project_group={data.project_group_contacts}
        />
      </div>

      {/* Right column (1/3 width) */}
      <div className="flex flex-col gap-6">
        <ProjectMemberList
          project_member={data.project_members}
          project_id={project_id}
          list_role={roleInProject}
          onUpdate={async () => await fetchDataProject()}
        />
        <StakeholderList
          stakeholder={data.project_stakeholders}
          project_id={data.id}
          onUpdate={fetchDataProject}
        />
      </div>
    </div>
  );
}

export default ProjectBase;
