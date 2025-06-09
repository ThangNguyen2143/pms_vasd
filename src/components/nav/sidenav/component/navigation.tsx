"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation as NavMenu, setNavigation } from "~/config/site";
import { clsx } from "clsx";
import { getMenu } from "~/lib/dal";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [nav, setNav] = useState<NavMenu[]>([]);
  useEffect(() => {
    // Hàm này có thể được sử dụng để lấy menu từ API nếu cần thiết
    const fetchMenu = async () => {
      try {
        const menu = await getMenu();
        if (menu) {
          // Cập nhật state với menu mới nếu cần
          setNav(setNavigation(menu));
        }
        // Xử lý menu nếu cần
      } catch (error) {
        console.error("Lỗi khi lấy menu:", error);
      }
    };
    fetchMenu();
  }, []); // Gọi hàm để lấy menu từ API, có thể cần thiết nếu menu được cập nhật động
  // Thêm loại tài khoản hiển thị trong menu điều hướng

  return nav.map((navigation) => {
    const Icon = navigation.icon;
    return (
      <li key={navigation.href}>
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
