"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink() {
  const pathname = usePathname();
  return (
    <div role="tablist" className="tabs tabs-lift">
      <Link
        href={"/user_manage"}
        role="tab"
        className={clsx("tab", pathname === "/user_manage" && "tab-active")}
      >
        Nhân viên
      </Link>
      <Link
        href={"/user_manage/groups"}
        role="tab"
        className={clsx(
          "tab",
          pathname === "/user_manage/groups" && "tab-active"
        )}
      >
        Nhóm người dùng
      </Link>
    </div>
  );
}

export default NavLink;
