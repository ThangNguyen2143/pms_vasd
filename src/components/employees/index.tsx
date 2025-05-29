/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { encodeBase64 } from "~/lib/services";
import { fetchData } from "~/lib/api-client";
import { AccountType, RoleType, UserDto } from "~/lib/types";
import Emp_Table from "./emp_table";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

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
  const [employees, setEmployees] = useState<UserDto[]>([]);
  const [enrichedEmployees, setEnrichedEmployees] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: users,
    getData: getUsers,
    errorData: errorUser,
  } = useApi<UserDto[]>();

  const {
    data: typeUsers,
    getData: getUserType,
    errorData: errorType,
  } = useApi<AccountType[]>();
  const {
    data: roleUsers,
    getData: getUserRole,
    errorData: errorRole,
  } = useApi<RoleType[]>();
  useEffect(() => {
    getUsers("/user/" + encodeBase64({ type: "all" }), "reload");
  }, []);
  useEffect(() => {
    if (users) {
      setEmployees(users);
      getUserType(
        "/system/config/" + encodeBase64({ type: "account_type" }),
        "force-cache"
      );
      getUserRole("/system/config/eyJ0eXBlIjoicm9sZSJ9", "force-cache");
    }
    if (errorUser)
      toast.error("Lỗi khi tải dữ liệu người dùng: " + errorUser.message);
  }, []);
  useEffect(() => {
    if (users) {
      const enrichedData = assignTypeAccountForData(users, typeUsers || []);
      enrichedData.then((data) => {
        setEmployees(data);
      });
    }
    if (errorUser) {
      toast.error("Lỗi khi tải dữ liệu người dùng: " + errorUser.message);
    }
    if (errorType) {
      toast.error("Lỗi khi tải loại tài khoản: " + errorType.message);
    }
    if (errorRole) {
      toast.error("Lỗi khi tải vai trò: " + errorRole.message);
    }
  }, [users, typeUsers, errorUser, errorType, errorRole]);
  useEffect(() => {
    const enrichUsers = async () => {
      if (!employees.length || !typeUsers || !roleUsers) return;

      const enriched = await Promise.all(
        employees.map(async (emp) => {
          const withRoles = await assignRoleForData(emp);
          return {
            ...withRoles,
            accountData: {
              ...emp.accountData,
              account_type:
                typeUsers.find(
                  (type) => type.code === emp.accountData.account_type
                )?.display || emp.accountData.account_type,
            },
          };
        })
      );
      setEnrichedEmployees(enriched);
    };
    enrichUsers();

    if (errorType)
      toast.error("Lỗi khi tải loại tài khoản: " + errorType.message);
    if (errorRole) toast.error("Lỗi khi tải vai trò: " + errorRole.message);
  }, [employees, typeUsers, roleUsers]);
  const fieldTable = [
    { code: "username", sub: "accountData", display: "Khởi tạo" },
    { code: "display_name", sub: "userData", display: "Họ tên" },
    { code: "account_type", sub: "accountData", display: "Vai trò" },
    { code: "roles", display: "Cấp quyền" },
    { code: "userid", display: "Khóa" },
    { code: "isActive", sub: "accountData", display: "Trạng thái" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(enrichedEmployees.length / PAGE_SIZE);
  const paginatedData = enrichedEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="flex flex-col gap-4">
      <Emp_Table
        empData={paginatedData}
        feildTable={fieldTable}
        typeAccount={typeUsers || []}
        roleList={roleUsers || []}
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
