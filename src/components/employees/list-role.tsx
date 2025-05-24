"use client";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { Contact } from "~/lib/types";
function roleCheck(item: Contact, roleOwn: Contact[]) {
  return roleOwn.find((t) => t.code == item.code) != undefined ? true : false;
}
function ListofRole({
  roleList,
  roleOwn,
  user_code,
  group_id,
}: {
  roleList: Contact[];
  roleOwn: Contact[];
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
  const handlerClick = async (role_code: string, isCheck: boolean) => {
    if (!isCheck) {
      if (user_code)
        await putData("/user/role", { role_code, type: "revoke", user_code });
      else if (group_id)
        await putData("/group/role", { role_code, type: "revoke", group_id });
    } else {
      if (user_code)
        await putData("/user/role", { role_code, type: "grant", user_code });
      else if (group_id)
        await putData("/group/role", { role_code, type: "grant", group_id });
    }
    if (errorData) toast.error(errorData.message);
    else toast.success("Xử lý thành công");
  };
  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        {roleList.map((item, i) => (
          <li className="list-row" key={"9i" + i}>
            <div>{item.value}</div>
            <div className="divider divider-horizontal"></div>
            {roleOwn ? (
              <input
                type="checkbox"
                className="checkbox"
                name={item.code}
                defaultChecked={roleCheck(item, roleOwn)}
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
