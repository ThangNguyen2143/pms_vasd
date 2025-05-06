"use client";

import { useActionState } from "react";
import { HandlerChangePwUser } from "./action";

function ChangePassForm({ userName }: { userName: string }) {
  const [state, action] = useActionState(HandlerChangePwUser, undefined);
  return (
    <form action={action} className="flex flex-col gap-2 items-center">
      <label className="floating-label">
        <span>Tài khoản</span>
        <input
          type="text"
          placeholder="Type here"
          readOnly
          value={userName}
          className="input input-md"
          name="username"
        />
      </label>

      <label className="floating-label">
        <span>Mật khẩu cũ</span>
        <input
          type="password"
          placeholder="Nhập mật khẩu cũ"
          className="input input-md"
          name="current_password"
        />
      </label>
      <label className="floating-label">
        <span>Mật khẩu mới</span>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          className="input input-md"
          name="new_password"
        />
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-info">
          Ok
        </button>
        <button type="reset" className="btn btn-ghost">
          Làm mới
        </button>
      </div>
    </form>
  );
}

export default ChangePassForm;
