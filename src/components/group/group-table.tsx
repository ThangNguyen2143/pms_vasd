/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountType, FieldDto, GroupDto, RoleType } from "~/lib/types";
import clsx from "clsx";
import RemoveGroupBtn from "./remove-group";
import GroupDetail from "./group-detail";

function TableItem({
  emp,
  feildTable,
  roles,
}: {
  emp: GroupDto;
  feildTable: FieldDto[];
  accountType?: any[];
  roles: RoleType[];
}) {
  return (
    <tr>
      {feildTable.map((item, index) => {
        if (item.display == "Thao tác") {
          return (
            <td key={"-99"}>
              <div className="drawer drawer-end">
                <input
                  id={`detail-group-drawer-${emp.group_id}`}
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content">
                  <label
                    htmlFor={`detail-group-drawer-${emp.group_id}`}
                    className="btn btn-info"
                  >
                    Chi tiết
                  </label>
                </div>
                <div className="drawer-side z-40">
                  <label
                    htmlFor={`detail-group-drawer-${emp.group_id}`}
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <GroupDetail group={emp} roles={roles} />
                </div>
              </div>
            </td>
          );
        } else if (item.display == "Xóa") {
          return (
            <td key={"-" + index}>
              <RemoveGroupBtn
                group_id={emp[item.code as keyof GroupDto] || ""}
              />
            </td>
          );
        } else if (item.display == "Trạng thái") {
          return (
            <td key={"-" + index}>
              <div className={clsx("badge", "badge-info")}>
                {emp.status
                  ? emp.status == "NEW"
                    ? "NEW"
                    : "Active"
                  : "Block"}
              </div>
            </td>
          );
        } else
          return (
            <td key={"a" + index}>
              {emp[item.code as keyof GroupDto]
                ? emp[item.code as keyof GroupDto]
                : ""}
            </td>
          );
      })}
    </tr>
  );
}
function Group_Table({
  groupData,
  feildTable,
  typeAccount,
  roles,
}: {
  groupData: GroupDto[];
  feildTable: FieldDto[];
  typeAccount?: AccountType[];
  roles: RoleType[];
}) {
  if (!groupData) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            {feildTable.map((item, index) => {
              return <th key={index}>{item.display}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {groupData.map((item, index) => {
            return (
              <TableItem
                emp={item}
                key={index}
                feildTable={feildTable}
                accountType={typeAccount}
                roles={roles}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Group_Table;
