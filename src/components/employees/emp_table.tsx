/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FieldDto, UserDto } from "~/lib/types";
import Dialog from "../ui/dialog";
import StatusBtn from "./status-btn";
import EditTypeModal from "./edit-type-account";
import ResetPassBtn from "./reset-pass";
import ListofRole from "./list-role";
import { useState } from "react";
function RenderCell({ emp, item }: { emp: UserDto; item: FieldDto }) {
  const value = item.sub
    ? (emp as any)[item.sub]?.[item.code]
    : (emp as any)[item.code];

  switch (item.display) {
    case "Trạng thái":
      return (
        <td className="flex gap-2 items-center">
          <StatusBtn idUser={emp.userid} isLocked={!emp.accountData.isActive} />
        </td>
      );

    case "Vai trò":
      return (
        <td>
          <EditTypeModal role={value} userid={emp.userid} />
        </td>
      );

    case "Khởi tạo":
      return (
        <td className="flex gap-2 items-center">
          <ResetPassBtn username={value} />
        </td>
      );

    case "Cấp quyền":
      return (
        <td>
          <Dialog
            nameBtn={<>Chỉnh sửa quyền</>}
            title="Cấp quyền tài khoản"
            typeBtn="ghost"
            id={`ROLE-${emp.userid}`}
          >
            <ListofRole user_code={emp.accountData.code} />
          </Dialog>
        </td>
      );

    default:
      return <td>{value ?? "Lỗi"}</td>;
  }
}

function TableItem({
  emp,
  feildTable,
}: {
  emp: UserDto;
  feildTable: FieldDto[];
}) {
  return (
    <tr>
      {feildTable.map((item: FieldDto, index: number) => (
        <RenderCell key={index} emp={emp} item={item} />
      ))}
    </tr>
  );
}

function Emp_Table({
  empData,
  feildTable,
}: {
  empData: UserDto[];
  feildTable: FieldDto[];
}) {
  const [findText, setTextFind] = useState("");

  if (!empData) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }

  const filtered = empData.filter((item) => {
    const name = item.userData?.display_name?.toLowerCase() || "";
    const email = item.userData?.contact?.[0]?.value?.toLowerCase() || "";
    return (
      name.includes(findText.toLowerCase()) ||
      email.includes(findText.toLowerCase())
    );
  });

  return (
    <>
      <div className="flex items-center gap-4">
        <label className="input">
          <span className="label">Tìm kiếm người dùng</span>
          <input
            type="text"
            placeholder="Nhập tên hoặc email..."
            value={findText}
            onChange={(e) => setTextFind(e.target.value)}
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {feildTable.map((item, index) => (
                <th key={index}>{item.display}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <TableItem
                key={emp.userid + "item"}
                emp={emp}
                feildTable={feildTable}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Emp_Table;
