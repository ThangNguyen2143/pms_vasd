import { X } from "lucide-react";
import { ProjectMemberDto, ProjectRole, UserDto } from "~/lib/types";
import AddMemberProjectBtn from "./add-member-btn";
import { useApi } from "~/hooks/use-api";
import { useEffect } from "react";
import { encodeBase64 } from "~/lib/services";

function ProjectMemberList({
  project_member,
  project_id,
  list_role,
}: {
  project_member?: ProjectMemberDto[];
  project_id: number;
  list_role: ProjectRole[] | null;
}) {
  const { getData: getUserList, data: userList } = useApi<UserDto[]>();

  const handleUpdateRole = (role_code: string) => {
    console.log("Role code", role_code);
    console.log(project_id);
  };
  useEffect(() => {
    getUserList("/user/" + encodeBase64({ type: "all" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
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
      <div>
        {project_member && project_member.length != 0 ? (
          <div>
            <ul className="list bg-base-100 rounded-box shadow-md">
              {project_member.map((member) => {
                return (
                  <li className="list-row" key={"project_member" + member.id}>
                    <div>{member.name}</div>

                    <div>
                      <div
                        tabIndex={0}
                        className="collapse border-base-300 border"
                      >
                        <div className="collapse-title font-semibold">
                          Xem quyền
                        </div>
                        <div className="collapse-content text-sm">
                          {member.role.map((r, i) => {
                            return (
                              <label
                                className="label"
                                key={i + "role" + member.id}
                              >
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  value={r.code + "" + member.id}
                                  onClick={(e) =>
                                    handleUpdateRole(e.currentTarget.value)
                                  }
                                />
                                {r.display || r.code}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-square btn-ghost">
                      <X color="#f00" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div>Tổng: {project_member.length} thành viên</div>
          </div>
        ) : (
          <div>Chưa có thành viên nào được thêm</div>
        )}
      </div>
    </div>
  );
}

export default ProjectMemberList;
