import Link from "next/link";

function SettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col justify-center items-center">
        {/* Page content here */}
        {children}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Mở
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-40 p-4">
          {/* Sidebar content here */}
          <li>
            <Link href={"/settings/matrix-bug"}>Ma trận bug</Link>
          </li>
          <li>
            <Link href={"/settings/requirement-criteria"}>
              Tiêu chí đánh giá yêu cầu
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SettingLayout;
