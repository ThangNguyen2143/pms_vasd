"use client";

import { useActionState, useEffect, useState } from "react";
import { HandlerChangePwUser } from "./action";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { logout } from "~/app/(auth)/login/actions/auth";

function ChangePassForm({
  userName,
  onClose,
}: {
  userName: string;
  onClose: () => void;
}) {
  const [states, action] = useActionState(HandlerChangePwUser, undefined);
  useEffect(() => {
    if (states && states.message && states.message.code == 200) {
      toast.success(states.message.message);
      logout();
    }
  }, [states]);
  const [toggleVisible, setToggleVisible] = useState(false);
  return (
    <div className="modal modal-open">
      <div className="modal-backdrop">
        {/* if there is a button in form, it will close the modal */}
        <button onClick={onClose}>✕</button>
      </div>
      <div className="modal-box">
        <h3 className="font-bold text-lg m-2">Thay đổi mật khẩu</h3>
        <form action={action} className="flex flex-col gap-2 items-center">
          <label className="input w-full">
            <span>Tài khoản</span>
            <input
              type="text"
              placeholder="Type here"
              readOnly
              value={userName || ""}
              className=""
              name="username"
            />
          </label>

          <label className="input w-full">
            <span>Mật khẩu cũ</span>
            <input
              type={toggleVisible ? "text" : "password"}
              placeholder="Nhập mật khẩu cũ"
              name="current_password"
            />
            <span
              className="badge badge-ghost cursor-pointer"
              onClick={() => setToggleVisible(!toggleVisible)}
            >
              {toggleVisible ? <Eye /> : <EyeClosed />}
            </span>
          </label>
          <label className="input w-full">
            <span>Mật khẩu mới</span>
            <input
              type={toggleVisible ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              name="new_password"
            />
            <span
              className="badge badge-ghost cursor-pointer"
              onClick={() => setToggleVisible(!toggleVisible)}
            >
              {toggleVisible ? <Eye /> : <EyeClosed />}
            </span>
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
      </div>
    </div>
  );
}

export default ChangePassForm;
