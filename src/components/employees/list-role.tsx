/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, RoleType } from "~/lib/types";
function roleCheck(item: Contact, roleOwn: Contact[]) {
  return roleOwn.find((t) => t.code == item.code) != undefined ? true : false;
}
function ListofRole({
  user_code,
  group_id,
}: {
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
  const { putData, isLoading, errorData } = useApi<"", DataSend>();
  const {
    data,
    errorData: errorGetRole,
    setData: setRole,
    getData: getRole,
  } = useApi<RoleType[]>();
  const {
    data: roleList,
    getData: getUserRole,

    errorData: errorRole,
  } = useApi<RoleType[]>();
  useEffect(() => {
    getUserRole("/system/config/eyJ0eXBlIjoicm9sZSJ9", "force-cache");
  }, []);
  useEffect(() => {
    let enpoint: string | undefined = undefined;
    if (group_id)
      enpoint =
        "/group/role/" +
        encodeBase64({
          type: "role",
          group_id,
        });
    if (user_code)
      enpoint =
        "/user/" +
        encodeBase64({
          type: "role",
          code: user_code,
        });
    if (enpoint) getRole(enpoint, "no-store");
  }, [user_code, group_id]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
    if (errorRole) toast.error(errorRole.message);
    if (errorGetRole) {
      if (errorGetRole.code == 404) setRole([]);
      else toast.error(errorGetRole.message);
    }
  }, [errorData, errorRole, errorGetRole]);

  const handlerClick = async (role_code: string, isCheck: boolean) => {
    let re;
    if (!isCheck) {
      if (user_code)
        re = await putData("/user/role", {
          role_code,
          type: "revoke",
          user_code,
        });
      else if (group_id)
        re = await putData("/group/role", {
          role_code,
          type: "revoke",
          group_id,
        });
    } else {
      if (user_code)
        re = await putData("/user/role", {
          role_code,
          type: "grant",
          user_code,
        });
      else if (group_id)
        re = await putData("/group/role", {
          role_code,
          type: "grant",
          group_id,
        });
    }
    if (re != "") return;
    else toast.success("Xử lý thành công");
  };
  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        {roleList &&
          roleList.map((item, i) => (
            <li className="list-row" key={"9i" + i}>
              <div>{item.value}</div>
              <div className="divider divider-horizontal"></div>
              {data ? (
                <input
                  type="checkbox"
                  className="checkbox"
                  name={item.code}
                  defaultChecked={roleCheck(item, data)}
                  value={item.code}
                  onClick={(e) =>
                    handlerClick(e.currentTarget.value, e.currentTarget.checked)
                  }
                  disabled={isLoading}
                />
              ) : errorGetRole && errorGetRole.code == 404 ? (
                <input
                  type="checkbox"
                  className="checkbox"
                  name={item.code}
                  value={item.code}
                  onClick={(e) =>
                    handlerClick(e.currentTarget.value, e.currentTarget.checked)
                  }
                  disabled={isLoading}
                />
              ) : (
                <span className="badge badge-error">Không thể tải dữ liệu</span>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ListofRole;
