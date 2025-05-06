"use client";
import Link from "next/link";
import { logout } from "~/app/(auth)/login/actions/auth";
import { encodeBase64 } from "~/lib/services";
import ChangePassForm from "../profile/change-pass";

function UserIcon({
  id,
  name,
  username,
}: {
  id: number;
  name: string;
  username: string;
}) {
  const userParse = encodeBase64({ id });
  return (
    <>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <div className="flex">{name}</div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link href={"/profiles/" + userParse} className="justify-between">
              Thông tin
            </Link>
          </li>
          <li>
            <a
              onClick={() =>
                document.getElementById("dialog_form_change_pass")?.showModal()
              }
            >
              Đổi mật khẩu
            </a>
          </li>
          <li>
            <a onClick={logout}>Đăng xuất</a>
          </li>
        </ul>
      </div>
      <dialog id="dialog_form_change_pass" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg m-2">Thay đổi mật khẩu</h3>
          <ChangePassForm userName={username} />
        </div>
      </dialog>
    </>
  );
}

export default UserIcon;
