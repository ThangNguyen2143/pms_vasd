"use client";
import Link from "next/link";
import UserIcon from "./user";
import Image from "next/image";
import Navigation from "./sidenav/component/navigation";
import ThemeToggle from "./theme-toggle";
import { useUser } from "~/providers/user-context";

export default function TopNav() {
  const { user, isAuthenticated, isLoading, logout } = useUser(); // Sử dụng hook useUser

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated && !isLoading) {
    return <div>Đang chuyển hướng...</div>; // Hoặc hiển thị loading
  }
  if (!user) return <div>Đang tải</div>;
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost xl:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-52 mt-3 w-52 p-2 shadow"
          >
            <Navigation />
          </ul>
        </div>
        <Link className="btn btn-ghost text-xl" href="/">
          <Image
            src={"/vasd_256.png"}
            alt="Logo"
            width={30}
            height={30}
            className="relative"
          />
          <h1>PMS VASD</h1>
        </Link>
      </div>

      <div className="navbar-center hidden xl:flex">
        <ul className="menu menu-horizontal px-1">
          <Navigation />
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggle />
        <UserIcon
          name={user.name}
          id={user.userId}
          username={user.name} // Hoặc thêm username vào User type nếu cần
          onLogout={handleLogout}
          // Thêm prop onLogout nếu cần
        />
      </div>
    </div>
  );
}
