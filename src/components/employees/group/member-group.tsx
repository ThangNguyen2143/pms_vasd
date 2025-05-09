/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldDto } from "~/lib/type";
import RemoveUserGroup from "./remove-user-group";

function TableItem({
  emp,
  feildTable,
  group_id,
}: {
  emp: any;
  feildTable: FieldDto[];
  group_id: string;
}) {
  return (
    <tr>
      {feildTable.map((item, index) => {
        if (item.display == "Hành động") {
          return (
            <td key={"-" + index}>
              <RemoveUserGroup group_id={group_id} user_code={emp[item.code]} />
            </td>
          );
        } else if (item.display == "Ngày tham gia") {
          const dateJoin = new Date(emp[item.code]);
          return (
            <td key={"date" + index}>
              {dateJoin.getDate() +
                "/" +
                dateJoin.getUTCMonth() +
                "/" +
                dateJoin.getFullYear()}
            </td>
          );
        } else
          return (
            <td key={"a" + index}>{emp[item.code] ? emp[item.code] : "Lỗi"}</td>
          );
      })}
    </tr>
  );
}
async function MemberGroup({
  empData,
  feildTable,
  group_id,
}: {
  empData: any[];
  feildTable: FieldDto[];
  group_id: string;
}) {
  if (!empData) {
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
          {empData.map((item, index) => {
            return (
              <TableItem
                emp={item}
                key={index}
                feildTable={feildTable}
                group_id={group_id}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default MemberGroup;
