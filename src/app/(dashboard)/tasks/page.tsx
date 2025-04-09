import Link from "next/link";
import ErrorMessage from "~/components/ui/error-message";
import { encodeBase64, getItem } from "~/lib/services";
import { ProductDto } from "~/lib/type";

async function TasksPage() {
  const dataList: {
    id: string;
    name: string;
    description: string;
    status: string;
    project?: any[]; // Thêm thuộc tính project vào kiểu dữ liệu
  }[] = [];
  const endpointProduct = "/product/" + encodeBase64({ type: "all" });
  const getDataProduct = await getItem({
    endpoint: endpointProduct,
  });
  if (getDataProduct?.code !== 200) {
    return (
      <ErrorMessage
        message={getDataProduct?.value.message}
        code={getDataProduct?.code}
      />
    );
  }
  const dataProduct = getDataProduct?.value;
  if (!dataProduct) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  for (const product of dataProduct) {
    const endpointProject =
      "/project/" + encodeBase64({ product_id: product.id });
    const dataProject = await getItem({ endpoint: endpointProject });
    if (dataProject?.code !== 200) {
      return (
        <ErrorMessage
          message={dataProject?.value.message}
          code={dataProject?.code}
        />
      );
    }
    const temp = dataProject?.value.map((item: any) => {
      return {
        project_id: item.id,
        name: item.name,
        description: item.description,
        status: item.status,
      };
    });
    dataList.push({
      id: product.id,
      name: product.name,
      description: product.description,
      status: product.status,
      project: temp,
    });
  }
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4 p-4">
        Vui lòng chọn một dự án để xem danh sách công việc
        <div className="flex justify-end">
          <div className="flex gap-4">
            {dataList.map((item, index) => {
              return (
                <div
                  key={index}
                  className="collapse collapse-arrow bg-base-100 border border-base-300"
                >
                  <input type="radio" name="my-accordion-2" />
                  <div className="collapse-title font-semibold">
                    {item.name}
                  </div>
                  <div key={index} className="collapse-content">
                    {item.project?.map((project, index) => {
                      return (
                        <div
                          key={index + 99}
                          className="card card-border bg-base-100 w-96"
                        >
                          <Link
                            href={`/tasks/${encodeBase64({
                              project_id: project.project_id,
                            })}`}
                            className="card-body"
                          >
                            <h2 className="card-title">{project.name}</h2>
                            <p>{project.description}</p>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default TasksPage;
