import AddProjectBtn from "~/components/project/add-project-btn";
import ProjectTable from "~/components/project/project-table";

function ProjectsPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-3xl font-bold text-center">Danh sách dự án</h1>
        <div className="flex justify-end">
          <AddProjectBtn />
        </div>
      </div>
      <ProjectTable />
    </main>
  );
}

export default ProjectsPage;
