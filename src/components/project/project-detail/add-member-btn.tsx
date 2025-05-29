"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Dialog from "~/components/ui/dialog";
// import { updateData } from "~/lib/api-client";
import { ProjectMemberDto, ProjectRole, UserDto } from "~/lib/types";

function AddMemberProjectBtn({
  listEmployee,
  memberGroup,
  project_id,
  list_role,
}: {
  listEmployee: UserDto[] | null;
  memberGroup?: ProjectMemberDto[];
  project_id: number;
  list_role: ProjectRole[];
}) {
  const meber: ProjectMemberDto[] = memberGroup || [];
  const [member, setMember] = useState<ProjectMemberDto[]>(meber);
  const handleAdd = async (user_id: string) => {
    const data = {
      project_id,
      user_id,
      role: [],
    };
    //  const res = await updateData<
    //    "",
    //    { project_id: string; user_id: number; role:{role_code:string}[] }
    //  >({ endpoint: "/project/member", data });
    const res = { code: 200, message: "Thành công test", value: data };
    if (res.code != 200) window.alert("Lỗi " + res.code + " " + res.message);
    else {
      toast.success("Đã xử lý thành công!");
      setMember([
        ...member,
        {
          id: 0,
          added_by: 12,
          contacts: [],
          date_join: Date.now().toString(),
          name: "",
          role: [],
        },
      ]);
    }
  };
  return (
    <Dialog
      nameBtn={<>Thêm thành viên</>}
      title="Chọn thành viên"
      typeBtn="primary"
    >
      <label className="input">
        <span className="label">Tìm kiếm</span>
        <input type="text" placeholder="Nhập tên" />
      </label>
      {listEmployee ? (
        <ul className="list rounded-box shadow-md gap-1.5 overflow-y-hidden">
          {listEmployee
            .filter((us) => {
              return member.find((mem) => mem.id == us.userid) == undefined;
            })
            .map((user) => {
              return (
                <li
                  key={user.userid}
                  className="flex justify-between p-2 bg-base-200 shadow"
                >
                  <div>{user.userData.display_name}</div>
                  {list_role.map((role) => {
                    return (
                      <div
                        className="tooltip"
                        data-tip={role.description}
                        key={role.code + " " + user.userid}
                      >
                        <label className="label">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="checkbox"
                          />
                          {role.display}
                        </label>
                      </div>
                    );
                  })}
                  <button
                    onClick={(e) => handleAdd(e.currentTarget.value)}
                    value={user.accountData.code}
                    className="btn btn-circle"
                  >
                    <Plus />
                  </button>
                </li>
              );
            })}
        </ul>
      ) : (
        <div>Không tải được dữ liệu người dùng</div>
      )}
    </Dialog>
  );
}

export default AddMemberProjectBtn;
