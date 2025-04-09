import { AlignJustify } from "lucide-react";
import { SideNav, TopNav } from "~/components/nav";
import { getSession } from "~/lib/session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const userName = session?.name || "User";
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          <AlignJustify className="w-5 h-5" />
        </label>
        <TopNav name={userName} />
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <SideNav />
      </div>
    </div>
  );
}
