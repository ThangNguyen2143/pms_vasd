"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { ProjectMemberDto, ProjectRole, UserDto } from "~/lib/types";
import Select from "react-select";
interface AddMemberToProject {
  project_id: number;
  user_id: number;
  role: {
    role_code: string;
  }[];
}
function AddMemberProjectModal({
  listEmployee,
  memberGroup,
  project_id,
  list_role,
  onClose,
  onUpdate,
}: {
  listEmployee: UserDto[] | null;
  memberGroup?: ProjectMemberDto[];
  project_id: number;
  list_role: ProjectRole[];
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const [userSelected, setuserSelected] = useState<number>(0);
  const [roles, setroles] = useState<{ role_code: string }[]>([]);
  const { putData, errorData, isLoading } = useApi<"", AddMemberToProject>();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerAddMember = async () => {
    if (roles.length == 0) {
      toast.warning("Hãy chọn vai trò thành viên");
      return;
    }
    const data: AddMemberToProject = {
      project_id,
      user_id: userSelected,
      role: roles,
    };
    const re = await putData("/project/member", data);
    if (re != "") {
      return;
    } else {
      await onUpdate();
      toast.success("Thêm thành viên thành công!");
      onClose();
    }
  };
  const options =
    listEmployee
      ?.filter((us) => {
        return memberGroup?.find((mem) => mem.id == us.userid) == undefined;
      })
      .map((user) => {
        return {
          value: user.userid,
          label: user.userData.display_name,
        };
      }) ?? [];
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Thêm thành viên dự án</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tên thành viên</legend>
          <Select
            className="w-full"
            placeholder="Chọn thành viên"
            value={options.find((emp) => emp.value === userSelected) || null}
            onChange={(selected) => setuserSelected(selected?.value ?? 0)}
            options={options}
            isClearable
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Vai trò</legend>
          <div className="join join-vertical">
            {list_role.map((role) => {
              return (
                <label className="label" key={role.code + "role"}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    value={role.code}
                    checked={
                      roles.find((r) => r.role_code == role.code) ? true : false
                    }
                    onChange={(e) => {
                      const findder = roles.find(
                        (r) => r.role_code == e.currentTarget.value
                      );
                      if (!findder)
                        setroles([
                          ...roles,
                          { role_code: e.currentTarget.value },
                        ]);
                      else
                        setroles(
                          roles.filter(
                            (_) => _.role_code !== e.currentTarget.value
                          )
                        );
                    }}
                  />
                  {role.display}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handlerAddMember()}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Thêm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMemberProjectModal;
