import { redirect } from "next/navigation";
import { Suspense } from "react";
import BugOverview from "~/components/bugs/bug-overview";
import BugsClient from "~/components/bugs/bugs-client";

export const metadata = {
  title: "Bugs",
  description: "Trang quản lý bug",
};
interface BugsPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}
async function BugsPage(props: BugsPageProps) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "list";

  // Nếu cần ép về tab hợp lệ
  if (!["list", "overview"].includes(tab)) {
    redirect("/bug?tab=list");
  }
  return (
    <main className="flex flex-col gap-4 p-4">
      <div role="tablist" className="tabs tabs-box mb-4">
        <a
          href="?tab=overview"
          role="tab"
          className={`tab ${tab === "overview" ? "tab-active" : ""}`}
        >
          Tổng quan
        </a>
        <a
          href="?tab=list"
          role="tab"
          className={`tab ${tab === "list" ? "tab-active" : ""}`}
        >
          Danh sách
        </a>
      </div>

      {tab === "list" && (
        <>
          <h1 className="text-3xl font-bold">Danh sách bugs</h1>
          <Suspense fallback={<div>Đang tải dữ liệu...</div>}>
            <BugsClient />
          </Suspense>
        </>
      )}
      {tab === "overview" && (
        <>
          <h1 className="text-2xl text-center font-bold">Tổng quan</h1>
          <BugOverview />
        </>
      )}
    </main>
  );
}

export default BugsPage;
