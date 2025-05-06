import ErrorMessage from "~/components/ui/error-message";
import { encodeBase64, getItem } from "~/lib/services";

async function ProjectPage() {
  const endpointProduct = "/product/" + encodeBase64({ type: "all" });
  const dataGet = await getItem({ endpoint: endpointProduct, cache: "reload" });
  if (dataGet?.code !== 200) {
    return (
      <ErrorMessage message={dataGet?.value.message} code={dataGet?.code} />
    );
  }
  const dataProduct = dataGet.value;
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Project</h1>
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
