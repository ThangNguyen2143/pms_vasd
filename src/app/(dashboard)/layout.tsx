import { TopNav } from "~/components/nav";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto p-4">
      <TopNav />
      {children}
    </main>
  );
}
