import { Metadata } from "next";
import { redirect } from "next/navigation";
import MainDisplayTask from "~/components/tasks/main-display-task";
import OverviewTab from "~/components/tasks/overview-tab";

export const metadata: Metadata = {
  title: "Task list",
  description: "Danh sách công việc của dự án",
};
interface TasksPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

async function TasksPage(props: TasksPageProps) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "list";

  // Nếu cần ép về tab hợp lệ
  if (!["list", "overview"].includes(tab)) {
    redirect("/task?tab=list");
  }
  return (
    <main className="flex flex-col container">
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
          <h1 className="text-2xl text-center font-bold">
            Danh sách công việc
          </h1>
          <MainDisplayTask />
        </>
      )}
      {tab === "overview" && (
        <>
          <h1 className="text-2xl text-center font-bold">Tổng quan</h1>
          <OverviewTab />
        </>
      )}
    </main>
  );
}

export default TasksPage;
