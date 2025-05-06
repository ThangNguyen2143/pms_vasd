"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink() {
  const pathname = usePathname();
  return (
    <div role="tablist" className="tabs tabs-lift">
      <Link
        href={"/employees"}
        role="tab"
        className={clsx("tab", pathname === "/employees" && "tab-active")}
      >
        Nhân viên
      </Link>
      <Link
        href={"/employees/groups"}
        role="tab"
        className={clsx(
          "tab",
          pathname === "/employees/groups" && "tab-active"
        )}
      >
        Nhóm người dùng
      </Link>
    </div>
  );
}

export default NavLink;
