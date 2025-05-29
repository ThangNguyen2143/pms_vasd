/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountType, FieldDto, GroupDto } from "~/lib/types";
import clsx from "clsx";
import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import RemoveGroupBtn from "./remove-group";

function TableItem({
  emp,
  feildTable,
}: {
  emp: GroupDto;
  feildTable: FieldDto[];
  accountType?: any[];
}) {
  return (
    <tr>
      {feildTable.map((item, index) => {
        if (item.display == "Thao tác") {
          return (
            <td key={"-99"}>
              <Link
                href={
                  "/employees/groups/" +
                  encodeBase64({
                    group_id: emp.group_id,
                  }) +
                  `?group_name=${emp.group_name}&group_description=${emp.group_description}`
                }
                className="btn btn-info"
              >
                Chi Tiết
              </Link>
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
}: {
  groupData: GroupDto[];
  feildTable: FieldDto[];
  typeAccount?: AccountType[];
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
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Group_Table;
