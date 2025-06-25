"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation as NavMenu, setNavigation } from "~/config/site";
import { clsx } from "clsx";
import { getMenu } from "~/lib/dal";
import { useEffect, useState } from "react";
import { AlignJustify } from "lucide-react";
function renderNavItem(navigation: NavMenu, pathname: string) {
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
        <span className="text-sm">{navigation.name}</span>
      </Link>
    </li>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [nav, setNav] = useState<NavMenu[]>([]);
  const [width, setWidth] = useState<number>(0);

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
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // cập nhật lần đầu

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Gọi hàm để lấy menu từ API, có thể cần thiết nếu menu được cập nhật động

  // Thêm loại tài khoản hiển thị trong menu điều hướng
  if (nav.length <= 4 || width >= 1536) {
    return nav.map((item) => renderNavItem(item, pathname));
  }

  const visibleNav = nav.slice(0, 4);
  const hiddenNav = nav.slice(4);

  return [
    ...visibleNav.map((item) => renderNavItem(item, pathname)),
    <li key="extendNav">
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="flex items-center cursor-pointer gap-2"
        >
          <AlignJustify size={16} />
          Thêm
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-50 bg-base-100 rounded-box w-40 p-2 shadow-sm"
        >
          {hiddenNav.map((item) => renderNavItem(item, pathname))}
        </ul>
      </div>
    </li>,
  ];
}
