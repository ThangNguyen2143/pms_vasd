import { Pencil } from "lucide-react";
import { getItem } from "~/lib/services";

async function ProjectByProjectPage({
  params,
}: {
  params: { product_id: string };
}) {
  const endpointProject = "/project/" + params.product_id;
  const dataProject = await getItem({ endpoint: endpointProject });
  console.log(dataProject, params.product_id);
  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Danh sách dự án</h1>
        <div className="flex justify-end">
          <button className="btn btn-primary">Thêm dự án</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên dự án</th>
              <th>Mô tả</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* {dataProject.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.start_date}</td>
                  <td>{item.end_date}</td>
                  <td>{item.status}</td>
                  <td>
                    <Pencil />
                  </td>
                </tr>
              );
            })} */}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ProjectByProjectPage;
