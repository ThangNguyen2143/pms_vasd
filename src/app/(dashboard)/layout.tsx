import { TopNav } from "~/components/nav";
import { ProjectProvider } from "~/providers/project-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto p-4">
      <TopNav />
      <ProjectProvider>{children}</ProjectProvider>
    </main>
  );
}
