"use client";
import { useEffect, useState } from "react";
import { ProjectMemberDto, ProjectRole, UserDto } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import AddMemberProjectModal from "./modals/add-member-modal";
import { Pencil, Plus, X } from "lucide-react";
import UpdateRoleModal from "./modals/update-role-modal";
import ConfirmDeleteMember from "./modals/confirm-deleted-member";
export default function ProjectMemberList({
  project_member,
  project_id,
  list_role,
  onUpdate,
}: {
  project_member?: ProjectMemberDto[];
  project_id: number;
  list_role: ProjectRole[] | null;
  onUpdate: () => Promise<void>;
}) {
  const { getData: getUserList, data: userList } = useApi<UserDto[]>();
  const [showModalAdd, setshowModalAdd] = useState(false);
  const [OpenConfirmRemove, setOpenConfirmRemove] =
    useState<ProjectMemberDto>();
  const [updateRoleMember, setupdateRoleMember] = useState<ProjectMemberDto>();
  useEffect(() => {
    getUserList("/user/" + encodeBase64({ type: "all" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4 border-b border-base-content/20 pb-1">
        <h2 className="text-lg font-bold text-primary ">👥 Thành viên dự án</h2>
        {list_role != null ? (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setshowModalAdd(true)}
          >
            <Plus></Plus>
          </button>
        ) : (
          <div className="badge badge-error">Không thể tải dữ liệu</div>
        )}
      </div>

      {project_member?.length ? (
        <div className="space-y-3">
          {project_member.map((member) => (
            <div key={member.id} className="bg-base-100 p-3 rounded border">
              <p>
                <span className="font-semibold">Họ tên:</span> {member.name}
              </p>
              <p>
                <span className="font-semibold">Vai trò:</span>{" "}
                {member.role.map((r, i) => (
                  <span key={i} className="badge badge-info mr-2">
                    {r.display || r.role_code}
                  </span>
                ))}
              </p>
              <p>
                <span className="font-semibold">Ngày tham gia:</span>{" "}
                {member.date_join}
              </p>
              <p>
                <span className="font-semibold">Người thêm:</span>{" "}
                {
                  userList?.find((user) => member.added_by == user.userid)
                    ?.userData.display_name
                }
              </p>
              <div className="flex justify-end">
                <div className="join">
                  <button
                    className="btn btn-sm join-item btn-primary"
                    onClick={() => setupdateRoleMember(member)}
                  >
                    <Pencil></Pencil>
                  </button>
                  <button
                    className="btn btn-sm join-item btn-error"
                    onClick={() => setOpenConfirmRemove(member)}
                  >
                    <X></X>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm text-gray-500">Chưa có thành viên nào.</p>
      )}
      {showModalAdd && list_role && (
        <AddMemberProjectModal
          listEmployee={userList}
          memberGroup={project_member}
          project_id={project_id}
          list_role={list_role}
          onClose={() => setshowModalAdd(false)}
          onUpdate={async () => await onUpdate()}
        />
      )}
      {updateRoleMember && list_role && (
        <UpdateRoleModal
          list_role={list_role}
          member={updateRoleMember}
          onClose={() => setupdateRoleMember(undefined)}
          onUpdate={onUpdate}
          project_id={project_id}
        />
      )}
      {OpenConfirmRemove && (
        <ConfirmDeleteMember
          member={OpenConfirmRemove}
          onClose={() => setOpenConfirmRemove(undefined)}
          onUpdate={onUpdate}
          project_id={project_id}
        />
      )}
    </div>
  );
}
