import AddProjectBtn from "~/components/project/add-project-btn";
import ProjectTable from "~/components/project/project-table";

function ProjectPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Danh sách dự án</h1>
        <div className="flex justify-between">
          <AddProjectBtn />
        </div>
      </div>
      <ProjectTable />
    </main>
  );
}

export default ProjectPage;
