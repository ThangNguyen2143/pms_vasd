"use client";
import { useActionState } from "react";
import { HandlerAddUser } from "./actions";
import ErrorMessage from "../ui/error-message";

function AddUserBtn() {
  const [state, action, pending] = useActionState(HandlerAddUser, undefined);
  return (
    <>
      <label htmlFor="AddUserDialog" className="btn btn-info">
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
                />
              </label>
              {state?.errors.display_name && (
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
                />
              </label>
              {state?.errors.username && (
                <div className="validator-hint text-error">
                  {state.errors.username}
                </div>
              )}
              <label className="select">
                <span className="label">Vai trò</span>
                <select
                  className="select select-ghost w-full max-w-xs"
                  name="account_type"
                >
                  <option value={"Support"} defaultChecked>
                    Support
                  </option>
                  <option value={"Admin"}>Admin</option>
                  <option value={"Dev"}>Dev</option>
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
              {state?.errors.email && (
                <div className="validator-hint text-error">
                  {state.errors.email}
                </div>
              )}
              <label className="input">
                <span className="label">Telegram</span>
                <input
                  type="text"
                  placeholder="Nhập Telegram"
                  name="telegram"
                  className="validator"
                />
              </label>
              {state?.errors.telegram && (
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
                  Tạo
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
      {state?.errors.server?.code && (
        <ErrorMessage
          message={state.errors.server.message}
          code={state.errors.server.code}
          hint={state.errors.server.hint}
        />
      )}
    </>
  );
}

export default AddUserBtn;
