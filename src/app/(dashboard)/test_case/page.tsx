//Add meta data

import { redirect } from "next/navigation";
import ClientTestCasesPage from "./client-testcase";
import TestcaseOverView from "~/components/testcase/testcase-overview-tab";

interface TestcasePageProps {
  searchParams: Promise<{ [key: string]: string }>;
}
async function TestcasePage(props: TestcasePageProps) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "list";

  // Nếu cần ép về tab hợp lệ
  if (!["list", "overview"].includes(tab)) {
    redirect("/testcase?tab=list");
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
          <h1 className="text-3xl text-center font-bold">
            Danh sách trường hợp kiểm thử
          </h1>
          <ClientTestCasesPage />
        </>
      )}
      {tab === "overview" && (
        <>
          <h1 className="text-2xl text-center font-bold">Tổng quan</h1>
          <TestcaseOverView />
        </>
      )}
    </main>
  );
}

export default TestcasePage;
