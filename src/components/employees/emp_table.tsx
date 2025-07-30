/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { AccountType, FieldDto, RoleType, UserDto } from "~/lib/types";
import Dialog from "../ui/dialog";
import StatusBtn from "./status-btn";
import EditTypeModal from "./edit-type-account";
import ResetPassBtn from "./reset-pass";
import ListofRole from "./list-role";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
function RenderCell({
  emp,
  item,
  roles,
  types,
}: {
  emp: UserDto;
  item: FieldDto;
  roles: RoleType[];
  types: AccountType[];
}) {
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
          <EditTypeModal role={value} userid={emp.userid} type={types} />
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
            <ListofRole user_code={emp.accountData.code} roles={roles} />
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
  roles,
  types,
}: {
  emp: UserDto;
  feildTable: FieldDto[];
  roles: RoleType[];
  types: AccountType[];
}) {
  return (
    <tr>
      {feildTable.map((item: FieldDto, index: number) => (
        <RenderCell
          key={index}
          emp={emp}
          item={item}
          roles={roles}
          types={types}
        />
      ))}
    </tr>
  );
}

function Emp_Table({
  empData,
  feildTable,
  types,
  roles,
}: {
  empData?: UserDto[];
  feildTable: FieldDto[];
  types: AccountType[];
  roles: RoleType[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [findText, setTextFind] = useState("");
  const [userList, setUserList] = useState<UserDto[]>([]);
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(userList.length / 10);
  // ⬅️ Khi load lại, đọc từ URL
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    if (pageParam >= 1 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    }
  }, [searchParams, totalPages]);
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    setCurrentPage(page);
  };
  useEffect(() => {
    if (empData) setUserList(empData);
  }, [empData]);
  useEffect(() => {
    if (empData) {
      const filteredUser = empData
        .filter((user) =>
          filterType ? user.accountData.account_type === filterType : true
        )
        .filter((user) => {
          return user
            ? user.userData.display_name
                .toLowerCase()
                .includes(findText.toLowerCase()) ||
                user.userData.contact[0]?.value
                  ?.toLowerCase()
                  .includes(findText.toLowerCase())
            : true;
        });
      setUserList(filteredUser);
    }
  }, [findText, filterType, empData]);
  // 🔄 Cắt dữ liệu theo trang
  const startIndex = (currentPage - 1) * 10;
  const currentUsers = userList.slice(startIndex, startIndex + 10);
  if (!userList) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  return (
    <>
      <div className="flex justify-between gap-4">
        <label className="input">
          <span className="label">Tìm kiếm người dùng</span>
          <input
            type="text"
            placeholder="Nhập tên hoặc email..."
            value={findText}
            onChange={(e) => setTextFind(e.target.value)}
          />
        </label>
        <form className="filter">
          <input
            className="btn btn-square"
            type="reset"
            value="×"
            onClick={() => setFilterType("")}
          />
          {types.map((type) => {
            return (
              <input
                className="btn"
                key={type.code}
                type="radio"
                name="frameworks"
                aria-label={type.display}
                value={type.code}
                checked={filterType === type.code}
                onChange={() => setFilterType(type.code)}
              />
            );
          })}
        </form>
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
            {currentUsers.map((emp) => (
              <TableItem
                key={emp.userid + "item"}
                emp={emp}
                feildTable={feildTable}
                roles={roles}
                types={types}
              />
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="join p-4 flex justify-center">
            {(() => {
              const paginationItems = [];

              // Nếu totalPages <= 5 → hiển thị tất cả
              if (totalPages <= 5) {
                for (let page = 1; page <= totalPages; page++) {
                  paginationItems.push(
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`join-item btn ${
                        page === currentPage ? "btn-active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              } else {
                // Trang đầu
                if (currentPage > 3) {
                  paginationItems.push(
                    <button
                      key={1}
                      className="join-item btn"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  );
                  if (currentPage > 4) {
                    paginationItems.push(
                      <button
                        key="start-ellipsis"
                        className="join-item btn btn-disabled"
                      >
                        ...
                      </button>
                    );
                  }
                }

                // Các trang gần current
                const start = Math.max(1, currentPage - 1);
                const end = Math.min(totalPages, currentPage + 1);
                for (let page = start; page <= end; page++) {
                  paginationItems.push(
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`join-item btn ${
                        page === currentPage ? "btn-active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  );
                }

                // Trang cuối
                if (currentPage < totalPages - 2) {
                  if (currentPage < totalPages - 3) {
                    paginationItems.push(
                      <button
                        key="end-ellipsis"
                        className="join-item btn btn-disabled"
                      >
                        ...
                      </button>
                    );
                  }
                  paginationItems.push(
                    <button
                      key={totalPages}
                      className="join-item btn"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  );
                }
              }

              return paginationItems;
            })()}
          </div>
        )}
      </div>
    </>
  );
}

export default Emp_Table;
