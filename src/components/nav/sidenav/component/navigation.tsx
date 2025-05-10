"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigations } from "~/config/site";
import { clsx } from "clsx";

export default function Navigation({ role }: { role?: string }) {
  const pathname = usePathname();
  // Thêm loại tài khoản hiển thị trong menu điều hướng
  if (role == "Guess") {
    return <li></li>;
  }
  return navigations.map((navigation) => {
    const Icon = navigation.icon;
    return (
      <li key={navigation.name}>
        <Link
          href={navigation.href}
          className={clsx(
            "flex items-center rounded-md px-2 py-1.5 hover:text-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800",
            pathname === navigation.href
              ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              : "bg-transparent"
          )}
        >
          <Icon size={16} className="mr-2" />
          <span className="text-sm ">{navigation.name}</span>
        </Link>
      </li>
    );
  });
}
