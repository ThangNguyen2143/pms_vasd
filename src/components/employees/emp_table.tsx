/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountType, Contact, FieldDto } from "~/lib/type";
import Dialog from "../ui/dialog";
import StatusBtn from "./status-btn";
import EditTypeModal from "./edit-type-account";
import ResetPassBtn from "./reset-pass";
import ListofRole from "./list-role";
import clsx from "clsx";

function TableItem({
  emp,
  feildTable,
  accountType,
  roleList,
}: {
  emp: any;
  feildTable: FieldDto[];
  accountType?: any[];
  roleList: Contact[];
}) {
  return (
    <tr>
      {feildTable.map((item, index) => {
        if (item.display == "Trạng thái" && item.sub) {
          return (
            <td key={"-" + index}>
              <div className={clsx("badge", "badge-info")}>
                {emp[item.sub][item.code]
                  ? emp[item.sub][item.code] == "NEW"
                    ? "NEW"
                    : "Active"
                  : "Block"}
              </div>
            </td>
          );
        } else if (item.display == "Khóa") {
          return (
            <td key={"-98"} className="flex gap-2 items-center">
              <StatusBtn
                idUser={emp[item.code]}
                isLocked={
                  emp.accountData.isActive ? emp.accountData.isActive : false
                }
              />
            </td>
          );
        } else if (item.display == "Vai trò" && item.sub) {
          return (
            <td key={"0" + index}>
              <EditTypeModal
                display={emp[item.sub][item.code]}
                accountType={accountType}
                userid={emp.userid}
              />
            </td>
          );
        } else if (item.display == "Khởi tạo" && item.sub) {
          // console.log(emp, item.sub, item.code);
          return (
            <td key={"-95"} className="flex gap-2 items-center">
              <ResetPassBtn username={emp[item.sub][item.code]} />
            </td>
          );
        } else if (item.display == "Cấp quyền") {
          return (
            <td key={"-90" + index}>
              {" "}
              <Dialog
                nameBtn="Chỉnh sửa quyền"
                title="Cấp quyền tài khoản"
                typeBtn="ghost"
                key={"ROLE" + index}
                id={index + "2" + emp["username"]}
              >
                <ListofRole
                  roleOwn={emp.roles}
                  roleList={roleList}
                  user_code={emp.accountData.code}
                />
              </Dialog>
            </td>
          );
        } else if (item.sub)
          return (
            <td key={"a" + index}>
              {emp[item.sub][item.code] ? emp[item.sub][item.code] : "Lỗi"}
            </td>
          );
        else
          return (
            <td key={"a" + index}>{emp[item.code] ? emp[item.code] : "Lỗi"}</td>
          );
      })}
    </tr>
  );
}
async function Emp_Table({
  empData,
  feildTable,
  typeAccount,
  roleList,
}: {
  empData: any[];
  feildTable: FieldDto[];
  typeAccount?: AccountType[];
  roleList?: Contact[];
}) {
  if (!empData) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  if (!roleList) {
    roleList = [];
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
          {empData.map((item, index) => {
            return (
              <TableItem
                emp={item}
                key={index}
                feildTable={feildTable}
                accountType={typeAccount}
                roleList={roleList}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Emp_Table;
