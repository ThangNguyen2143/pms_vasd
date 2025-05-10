import { EmployeeTab } from "~/components/employees";
import type { Metadata } from "next";
import AddUserBtn from "~/components/employees/add-user-btn";
import { encodeBase64 } from "~/lib/services";
import { fetchData } from "~/lib/api-client";
import { AccountType, ResponseError } from "~/lib/types";
import ErrorMessage from "~/components/ui/error-message";

export const metadata: Metadata = {
  title: "Quản lý nhân viên",
  description: "Trang quản lý nhân viên",
};

async function EmployeesPage() {
  const endpointType =
    "/system/config/" + encodeBase64({ type: "account_type" });
  const getTypeAccount = await fetchData<AccountType[]>({
    endpoint: endpointType,
    cache: "force-cache",
  });
  return (
    <div className="tabs tabs-box">
      <div className="border-base-300 bg-base-100 p-10 w-full">
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
                <span className="label">Vai trò</span>
                <select>
                  <option value="">Tất cả</option>
                  {getTypeAccount.code === 200 &&
                    getTypeAccount.value.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.display}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </div>
          <EmployeeTab typeAccount={getTypeAccount.value} />
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
      {getTypeAccount.code !== 200 ? (
        <ErrorMessage
          isOpen={true}
          errorData={getTypeAccount as unknown as ResponseError}
        />
      ) : null}
    </div>
  );
}

export default EmployeesPage;
