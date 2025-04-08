import { encodeBase64, getItem } from "~/lib/services";

async function ProjectPage() {
  const endpointProduct = "/product/" + encodeBase64({ type: "all" });
  const dataProduct = await getItem({ endpoint: endpointProduct });
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Project</h1>
      <p className="text-gray-500">This is the project page.</p>
      <p className="text-gray-500">You can manage your projects here.</p>
      <p className="text-gray-500">You can add, edit, and delete projects.</p>
      <p className="text-gray-500">You can also view project details.</p>
      <p className="text-gray-500">You can also view project members.</p>
      <p className="text-gray-500">You can also view project tasks.</p>
      <p className="text-gray-500">You can also view project comments.</p>
      <p className="text-gray-500">You can also view project files.</p>
      <details className="dropdown">
        <summary className="btn m-1">Chọn sản phẩm</summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          {dataProduct.map((item, index) => {
            return (
              <li key={index}>
                <a href={"/projects/" + item.id}>{item.name}</a>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}

export default ProjectPage;
