/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { encodeBase64 } from "~/lib/services";
import { useEffect } from "react";
import Emp_Table from "./emp_table";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { UserDto } from "~/lib/types";

function EmployeeTab() {
  const {
    data: users,
    getData: getUsers,
    errorData: errorUser,
  } = useApi<UserDto[]>();

  useEffect(() => {
    getUsers("/user/" + encodeBase64({ type: "all" }), "reload");
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
    <div className="flex flex-col gap-4">
      <Emp_Table empData={users || []} feildTable={fieldTable} />
    </div>
  );
}

export default EmployeeTab;
