import { AlignJustify } from "lucide-react";
import { SideNav, TopNav } from "~/components/nav";
import { getUser } from "~/lib/dal";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUser();
  const userName = session?.username || "User";
  const userId = session?.id || 0;
  const name = session?.name || "";
  return (
    <main>
      <TopNav name={name} userId={userId} username={userName} />
      {children}
    </main>
  );
}
