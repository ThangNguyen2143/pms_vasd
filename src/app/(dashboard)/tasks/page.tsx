import SelectProject from "~/components/tasks/select-project";
async function TasksPage() {
  return (
    <main className="flex flex-col p-24">
      <div className="flex flex-col gap-4 p-4">
        <h2> Vui lòng chọn một dự án để xem danh sách công việc</h2>
        <SelectProject />
      </div>
    </main>
  );
}

export default TasksPage;
