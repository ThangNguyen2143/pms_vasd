"use client";
import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
// import { BrushCleaning } from "lucide-react";
import ChangePassForm from "../profile/change-pass";
import { toast } from "sonner";
import { useState } from "react";

function UserIcon({
  id,
  name,
  username,
  onLogout,
}: {
  id?: number;
  name: string;
  username: string;
  onLogout: () => void;
}) {
  const [showModalChangePass, setShowModalChangePass] = useState(false);
  if (!id) return <div className="btn btn-ghost">Đang tải...</div>;

  const userParse = encodeBase64({ id });
  const handlerClearCache = async () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Xóa cache thành công");
  };
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
            <a onClick={() => setShowModalChangePass(true)}>Đổi mật khẩu</a>
          </li>
          <li>
            <a onClick={() => handlerClearCache()}>
              Clear cache
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-brush-cleaning-icon lucide-brush-cleaning"
              >
                <path d="m16 22-1-4" />
                <path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1" />
                <path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z" />
                <path d="m8 22 1-4" />
              </svg>
            </a>
          </li>
          <li>
            <a onClick={onLogout}>Đăng xuất</a>
          </li>
          <li className="menu-disabled text-xs flex justify-end">
            <a>V1.0.10</a>
          </li>
        </ul>
      </div>
      {showModalChangePass && (
        <ChangePassForm
          userName={username}
          onClose={() => setShowModalChangePass(false)}
        />
      )}
    </>
  );
}

export default UserIcon;
