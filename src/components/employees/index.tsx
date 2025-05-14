/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { encodeBase64 } from "~/lib/services";
import { fetchData } from "~/lib/api-client";
import { AccountType, RoleType, UserDto } from "~/lib/types";
import Emp_Table from "./emp_table";
import { toast } from "sonner";

const PAGE_SIZE = 10;

async function assignRoleForData(data: UserDto) {
  const endpoint =
    "/user/" + encodeBase64({ type: "role", code: data.accountData.code });
  const userRoleRespone = await fetchData<RoleType[]>({
    endpoint,
    cache: "no-cache",
  });

  if (userRoleRespone.code === 200) {
    return { ...data, roles: userRoleRespone.value };
  }

  return { ...data, roles: [] };
}

async function assignTypeAccountForData(
  data: UserDto[],
  typeAccount: AccountType[]
) {
  const res: any[] = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const withRoles = await assignRoleForData(item);
    res.push({
      ...withRoles,
      accountData: {
        ...item.accountData,
        account_type:
          typeAccount.find(
            (type) => type.code === item.accountData.account_type
          )?.display || item.accountData.account_type,
      },
    });
  }

  return res;
}

function EmployeeTab() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [typeAccount, setTypeAccount] = useState<AccountType[]>([]);
  const [roleList, setRoleList] = useState<RoleType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const endpoint = "/user/" + encodeBase64({ type: "all" });
        const typeEndpoint =
          "/system/config/" + encodeBase64({ type: "account_type" });
        const roleEndpoint = "/system/config/eyJ0eXBlIjoicm9sZSJ9";

        const [userRes, typeRes, roleRes] = await Promise.all([
          fetchData<UserDto[]>({ endpoint, cache: "no-cache" }),
          fetchData<AccountType[]>({ endpoint: typeEndpoint }),
          fetchData<RoleType[]>({
            endpoint: roleEndpoint,
            cache: "force-cache",
          }),
        ]);

        if (userRes.code !== 200)
          throw new Error("Không lấy được danh sách người dùng");
        if (typeRes.code !== 200)
          throw new Error("Không lấy được loại tài khoản");
        if (roleRes.code !== 200) throw new Error("Không lấy được vai trò");

        setTypeAccount(typeRes.value);
        setRoleList(roleRes.value);

        const enrichedData = await assignTypeAccountForData(
          userRes.value,
          typeRes.value
        );
        setEmployees(enrichedData);
      } catch (err: any) {
        toast.error("Lỗi khi tải dữ liệu: " + err.message);
      }
    };

    loadData();
  }, []);

  const fieldTable = [
    { code: "username", sub: "accountData", display: "Khởi tạo" },
    { code: "display_name", sub: "userData", display: "Họ tên" },
    { code: "account_type", sub: "accountData", display: "Vai trò" },
    { code: "roles", display: "Cấp quyền" },
    { code: "userid", display: "Khóa" },
    { code: "isActive", sub: "accountData", display: "Trạng thái" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(employees.length / PAGE_SIZE);
  const paginatedData = employees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="flex flex-col gap-4">
      <Emp_Table
        empData={paginatedData}
        feildTable={fieldTable}
        typeAccount={typeAccount}
        roleList={roleList}
      />

      {/* Pagination Controls */}
      <div className="join self-center">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`join-item btn ${
              currentPage === i + 1 ? "btn-active" : ""
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmployeeTab;
