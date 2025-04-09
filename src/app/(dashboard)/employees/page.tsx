import { EmployeeTab, GroupTab } from "~/components/employees";
import type { Metadata } from "next";
import AddUserBtn from "~/components/employees/add-user-btn";

export const metadata: Metadata = {
  title: "Quản lý nhân viên",
  description: "Trang quản lý nhân viên",
};

function EmployeesPage() {
  return (
    <div className="tabs tabs-box">
      <input
        type="radio"
        name="group_tabs"
        className="tab"
        aria-label="Nhân viên"
      />
      <div className="tab-content border-base-300 bg-base-100 p-10">
        <div className="flex flex-col w-full h-full align-middle gap-4">
          <div className="flex flex-row justify-between items-center">
            <p>Danh sách người dùng</p>
            <AddUserBtn />
          </div>
          <div className="flex flex-row justify-between items-center gap-4">
            <div>
              <label className="input">
                <span className="label">Tìm kiếm người dùng</span>
                <input type="text" placeholder="Nhập tên hoặc email..." />
              </label>
            </div>
            <div>
              <label className="select">
                <span className="label">Trạng thái</span>
                <select>
                  <option>Đang hoạt động</option>
                  <option>Đang khóa</option>
                </select>
              </label>
            </div>
          </div>
          <EmployeeTab />
        </div>
      </div>
      <input
        type="radio"
        name="group_tabs"
        className="tab"
        aria-label="Nhóm người dùng"
      />

      <div className="tab-content border-base-300 bg-base-100 p-10">
        <div className="flex flex-col w-full h-full align-middle gap-4">
          <div className="flex flex-row justify-between items-center">
            <p>Danh sách nhóm</p>
            <button className="btn btn-info">Tạo nhóm</button>
          </div>
          <div className="flex flex-row justify-between items-center gap-4">
            <div>
              <label className="input">
                <span className="label">Tìm kiếm nhóm</span>
                <input type="text" placeholder="Nhập tên nhóm" />
              </label>
            </div>
            <div>
              <label className="select">
                <span className="label">Trạng thái</span>
                <select>
                  <option>Đang hoạt động</option>
                  <option>Đang khóa</option>
                </select>
              </label>
            </div>
          </div>
          <GroupTab />
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;
