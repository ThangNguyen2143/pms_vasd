/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { encodeBase64 } from "~/lib/services";
import { Suspense, useEffect } from "react";
import Emp_Table from "./emp_table";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { AccountType, RoleType, UserDto } from "~/lib/types";
import AddUserBtn from "./add-user-btn";

function EmployeeTab() {
  const {
    data: users,
    getData: getUsers,
    errorData: errorUser,
  } = useApi<UserDto[]>();
  const { data: account_type, getData: getType } = useApi<AccountType[]>();
  const { data: roleUser, getData: getRole } = useApi<RoleType[]>();
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  useEffect(() => {
    getUsers(endpointUser, "reload");
    getType("/system/config/" + encodeBase64({ type: "account_type" }));
    getRole("/system/config/" + encodeBase64({ type: "role" }));
  }, []);
  useEffect(() => {
    if (errorUser) toast.error(errorUser.message);
  }, [errorUser]);
  const fieldTable = [
    { code: "username", sub: "accountData", display: "Khởi tạo" },
    { code: "display_name", sub: "userData", display: "Họ tên" },
    { code: "account_type", sub: "accountData", display: "Vai trò" },
    { code: "roles", display: "Cấp quyền" },
    { code: "isActive", sub: "accountData", display: "Trạng thái" },
  ];

  return (
    <div className="border-base-300 bg-base-100 p-10 w-full">
      <div className="flex flex-col w-full h-full align-middle gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Danh sách người dùng</h1>
          <AddUserBtn
            account_type={account_type || []}
            onUpdate={async () => {
              getUsers(endpointUser, "reload");
            }}
          />
        </div>
        <Suspense fallback={<div>Đang tải</div>}>
          <Emp_Table
            empData={users || undefined}
            feildTable={fieldTable}
            roles={roleUser || []}
            types={account_type || []}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default EmployeeTab;
