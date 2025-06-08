import EmployeeTab from "~/components/employees";
import type { Metadata } from "next";
import AddUserBtn from "~/components/employees/add-user-btn";

export const metadata: Metadata = {
  title: "Quản lý nhân viên",
  description: "Trang quản lý nhân viên",
};

function EmployeesPage() {
  return (
    <div className="tabs tabs-box">
      <div className="border-base-300 bg-base-100 p-10 w-full">
        <div className="flex flex-col w-full h-full align-middle gap-4">
          <div className="flex flex-row justify-between items-center">
            <p>Danh sách người dùng</p>
            <AddUserBtn />
          </div>
          <EmployeeTab />
        </div>
      </div>
      <input type="checkbox" id="modal_success" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Thông báo</h3>
          <p className="py-4">Xử lý thành công</p>
        </div>
        <label className="modal-backdrop" htmlFor="modal_success">
          Đóng
        </label>
      </div>
    </div>
  );
}

export default EmployeesPage;
