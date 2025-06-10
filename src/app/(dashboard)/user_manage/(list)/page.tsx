import EmployeeTab from "~/components/employees";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý nhân viên",
  description: "Trang quản lý nhân viên",
};

async function EmployeesPage() {
  return (
    <div className="tabs tabs-box">
      <EmployeeTab />
    </div>
  );
}

export default EmployeesPage;
