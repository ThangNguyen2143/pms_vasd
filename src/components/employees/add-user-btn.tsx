"use client";
import { useActionState, useEffect, useState } from "react";
import { HandlerAddUser } from "./actions";
import { AccountType } from "~/lib/type";
import ErrorMessage from "../ui/error-message";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";

function AddUserBtn() {
  const [state, action, pending] = useActionState(HandlerAddUser, undefined);
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);
  const {
    data: account_type,
    isLoading,
    getData,
    errorData,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
  } = useApi<AccountType[]>();
  const loadTypeAccount = () => {
    getData("/system/config/" + encodeBase64({ type: "account_type" })); // Load account type from API
  };
  useEffect(() => {
    if (state?.message) {
      setIsOpenErrorDialog(true); // Show error dialog if there is a message
    }
    loadTypeAccount(); // Load account type when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.message]); // Only run when state.message changes
  return (
    <>
      <label
        htmlFor="AddUserDialog"
        className="btn btn-info"
        onClick={loadTypeAccount}
      >
        Thêm tài khoản
      </label>
      <input type="checkbox" id="AddUserDialog" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box justify-items-center">
          <h3 className="text-xl font-bold p-4">Thêm tài khoản mới</h3>
          <form action={action}>
            <div className="flex flex-col gap-4 justify-center">
              <label className="input">
                <span className="label">Họ và tên</span>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  name="display_name"
                  className="validator"
                  pattern="^[\p{L} ]+$"
                  title="Họ và tên không được chứa ký tự đặc biệt"
                />
              </label>
              {state?.errors?.display_name && (
                <div className="validator-hint text-error">
                  {state.errors.display_name}
                </div>
              )}
              <label className="input">
                <span className="label">Tên tài khoản</span>
                <input
                  type="text"
                  placeholder="Nhập tên tài khoản"
                  name="username"
                  className="validator"
                  minLength={4}
                  maxLength={20}
                />
              </label>
              {state?.errors?.username && (
                <div className="validator-hint text-error">
                  {state.errors.username}
                </div>
              )}
              <label className="select">
                <span className="label">Vai trò</span>
                <select
                  className="select select-ghost w-full max-w-xs"
                  name="account_type"
                  disabled={isLoading}
                >
                  {account_type?.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.display}
                    </option>
                  ))}
                </select>
              </label>
              <label className="input">
                <span className="label">Email</span>
                <input
                  type="email"
                  placeholder="Nhập email"
                  name="email"
                  className="validator"
                />
              </label>
              {state?.errors?.email && (
                <div className="validator-hint text-error">
                  {state.errors.email}
                </div>
              )}
              <label className="input">
                <span className="label">Telegram</span>
                <input
                  type="text"
                  placeholder="Nhập Id Telegram"
                  name="telegram"
                  className="validator"
                  pattern="^([0-9]{10})$"
                  minLength={10}
                  maxLength={10}
                  title="Id Telegram phải là 10 chữ số"
                />
              </label>
              {state?.errors?.telegram && (
                <div className="validator-hint text-error">
                  {state.errors.telegram}
                </div>
              )}
              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  disabled={pending}
                >
                  {pending ? "Đang xử lý..." : "Thêm"}
                </button>
                <label htmlFor="AddUserDialog" className="btn btn-error ml-4">
                  Hủy
                </label>
              </div>
            </div>
          </form>

          <label className="modal-backdrop" htmlFor="AddUserDialog">
            Close
          </label>
        </div>
      </div>
      <ErrorMessage
        isOpen={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
        errorData={errorData}
      />
      {state?.message && (
        <ErrorMessage
          isOpen={isOpenErrorDialog}
          onOpenChange={setIsOpenErrorDialog}
          errorData={{
            message: state.message.message,
            code: state.message.code,
            hint: state.message.hint,
            status: "error",
            value: "",
          }}
        />
      )}
    </>
  );
}

export default AddUserBtn;
