"use clinet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { ProjectMemberDto, ProjectRole } from "~/lib/types";
interface UpdateRole {
  project_id: number;
  user_id: number;
  role: {
    role_code: string;
  }[];
}
function UpdateRoleModal({
  member,
  project_id,
  list_role,
  onClose,
  onUpdate,
}: {
  member: ProjectMemberDto;
  project_id: number;
  list_role: ProjectRole[];
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const [roles, setroles] = useState<{ role_code: string }[]>([...member.role]);
  const { putData, errorData, isLoading } = useApi<"", UpdateRole>();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerAddMember = async () => {
    if (roles.length == 0) {
      toast.warning("Hãy chọn vai trò thành viên");
      return;
    }
    const data: UpdateRole = {
      project_id,
      user_id: member.id,
      role: roles,
    };
    const re = await putData("/project/member/role", data);
    if (!re) {
      return;
    } else {
      toast.success("Xử lý thành công");
      await onUpdate();
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cập nhật quyền</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Cho thành viên</legend>
          <input className="input" value={member.name} readOnly disabled />
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
              "Cập nhật"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateRoleModal;
