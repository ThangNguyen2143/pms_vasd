import { Pencil } from "lucide-react";
import ErrorMessage from "~/components/ui/error-message";
import { encodeBase64, getItem } from "~/lib/services";

function reshapeData(data: any[], userData: any[]) {
  if (!data || !userData) {
    return [];
  }

  return data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdBy: userData.find((user) => user.userid === item.create_by)
        ?.userData?.display_name,
      status: item.status,
    };
  });
}
async function ProductsPage() {
  const endpointProduct = "/product/" + encodeBase64({ type: "all" });
  const dataProduct = await getItem({ endpoint: endpointProduct });
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  const dataUser = await getItem({ endpoint: endpointUser });
  if (dataProduct?.code !== 200) {
    return (
      <ErrorMessage
        message={dataProduct?.value.message}
        code={dataProduct?.code}
        hint={dataProduct?.value.hint}
      />
    );
  }
  if (dataUser?.code !== 200) {
    return (
      <ErrorMessage
        message={dataUser?.value.message}
        code={dataUser?.code}
        hint={dataUser?.value.hint}
      />
    );
  }
  const dataList = reshapeData(dataProduct?.value, dataUser?.value);
  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        <div className="flex justify-end">
          <button className="btn btn-primary">Thêm sản phẩm</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Người tạo</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.createdBy}</td>
                  <td>{item.status}</td>
                  <td>
                    <Pencil />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ProductsPage;
