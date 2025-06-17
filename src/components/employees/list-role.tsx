/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, RoleType } from "~/lib/types";
function roleCheck(item: Contact, roleOwn: Contact[]) {
  return roleOwn.some((t) => t.code == item.code);
}
function ListofRole({
  user_code,
  group_id,
  roles,
}: {
  roles: RoleType[];
  user_code?: string;
  group_id?: string;
}) {
  type DataSend =
    | {
        type: string;
        user_code: string;
        role_code: string;
      }
    | {
        type: string;
        group_id: string;
        role_code: string;
      };
  // const [roleList, setRoleList] = useState<RoleType[]>(roles || []);
  const [findRole, setFindRole] = useState<string>("");
  const { putData, isLoading, errorData } = useApi<"", DataSend>();
  const {
    data,
    errorData: errorGetRole,
    setData: setRole,
    getData: getGrantedRoles,
  } = useApi<RoleType[]>();

  useEffect(() => {
    const endpoint = user_code
      ? `/user/${encodeBase64({ type: "role", code: user_code })}`
      : group_id
      ? `/group/role/${encodeBase64({ type: "role", group_id })}`
      : undefined;

    if (endpoint) getGrantedRoles(endpoint, "no-store");
  }, [user_code, group_id, isLoading]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
    if (errorGetRole) {
      if (errorGetRole.code == 404) setRole([]);
      else toast.error(errorGetRole.message);
    }
  }, [errorData, errorGetRole]);

  const handleRoleChange = async (role_code: string, isChecked: boolean) => {
    const type = isChecked ? "grant" : "revoke";

    const payload = user_code
      ? { type, role_code, user_code }
      : group_id
      ? { type, role_code, group_id }
      : undefined;
    if (payload) {
      const response = await putData(
        user_code ? "/user/role" : "/group/role",
        payload
      );
      if (response !== "") return;
      toast.success("Xử lý thành công");
    } else {
      toast.warning("Không tìm thấy dữ liệu");
    }
  };

  const renderCheckbox = (item: RoleType) => {
    const isChecked = data
      ? roleCheck(item, data)
      : errorGetRole?.code === 404
      ? false
      : undefined;
    return (
      <input
        type="checkbox"
        className="checkbox"
        name={item.code}
        value={item.code}
        checked={isChecked ? isChecked : false}
        onChange={(e) => handleRoleChange(e.target.value, e.target.checked)}
        disabled={isLoading || isChecked === undefined}
      />
    );
  };
  const filteredRoles = useMemo(() => {
    const keyword = findRole.toLowerCase();
    return roles.filter((role) =>
      findRole ? role.value.toLowerCase().includes(keyword) : true
    );
  }, [roles, findRole]);

  return (
    <div className="overflow-x-auto">
      <div>
        <label className="input input-accent">
          <span className="label">
            <Search />
          </span>
          <input
            type="text"
            placeholder="Tìm nhanh"
            value={findRole}
            onChange={(e) => setFindRole(e.target.value)}
          />
        </label>
      </div>
      <table className="table bg-base-100 table-pin-rows">
        <thead>
          <tr>
            <th>Mô tả</th>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
          </tr>
        </thead>
        <tbody className="">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((item, i) => (
              <tr key={"9i" + i}>
                <td>{item.value}</td>
                <td>{renderCheckbox(item)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>Không tìm thấy dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListofRole;
