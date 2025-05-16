"use client";
import { useEffect } from "react";
import { ProjectMemberDto, ProjectRole, UserDto } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import AddMemberProjectBtn from "./add-member-btn";
import { encodeBase64 } from "~/lib/services";
export default function ProjectMemberList({
  project_member,
  project_id,
  list_role,
}: {
  project_member?: ProjectMemberDto[];
  project_id: number;
  list_role: ProjectRole[] | null;
}) {
  const { getData: getUserList, data: userList } = useApi<UserDto[]>();

  useEffect(() => {
    getUserList("/user/" + encodeBase64({ type: "all" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-primary border-b border-base-content/20 pb-1">
          👥 Thành viên dự án
        </h2>
        {list_role != null ? (
          <AddMemberProjectBtn
            listEmployee={userList}
            memberGroup={project_member}
            project_id={project_id}
            list_role={list_role}
          />
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
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm text-gray-500">Chưa có thành viên nào.</p>
      )}
    </div>
  );
}
