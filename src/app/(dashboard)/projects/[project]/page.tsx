import { notFound } from "next/navigation";
import MainDisplayOnProject from "~/components/project/project-detail";
import { decodeBase64 } from "~/lib/services";

async function ProjectDetailPage(props: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await props.params;
  if (!project) notFound();
  const { project_id } = decodeBase64(decodeURIComponent(project)) as {
    project_id: number;
  };
  if (!project_id) notFound();
  return (
    <div>
      <div className="mt-3">
        <h1 className="text-3xl font-bold my-4">Thông tin chi tiết</h1>
      </div>
      <MainDisplayOnProject project_id={project_id} />
    </div>
  );
}

export default ProjectDetailPage;
