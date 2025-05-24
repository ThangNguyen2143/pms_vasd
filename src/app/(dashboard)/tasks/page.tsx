import { Metadata } from "next";
import MainDisplayTask from "~/components/tasks/main-display-task";

export const metadata: Metadata = {
  title: "Task list",
  description: "Danh sách công việc của dự án",
};
function TasksPage() {
  return (
    <main className="flex flex-col p-24">
      <h1 className="text-2xl text-center font-bold">Danh sách công việc</h1>
      <MainDisplayTask />
    </main>
  );
}

export default TasksPage;
