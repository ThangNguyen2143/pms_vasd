/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductDto, UserDto } from "~/lib/types";
import { Activity, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteData, updateData } from "~/lib/api-client";

function reshapeData(data: ProductDto[] | null, userData: UserDto[] | null) {
  if (!data || !userData) {
    return [];
  }

  return data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdBy: userData.find((user) => {
        return user.userid == item.create_by;
      })?.userData?.display_name,
      status: item.status,
    };
  });
}

function ProductTable({ project_id }: { project_id: number }) {
  const {
    data: productList,
    getData: getProduct,
    errorData,
  } = useApi<ProductDto[]>();
  const { data: userList, getData: getUser } = useApi<UserDto[]>();
  const {
    putData,
    errorData: errorUpdateStatus,
    isLoading: activeLoading,
  } = useApi<"", { id: string; status: string }>();
  const [selectedProduct, setSelectedProduct] = useState<ProductDto>();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  const openEditDialog = (product: ProductDto) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };
  const endpointProduct =
    "/product/" + encodeBase64({ type: "all", project_id });
  useEffect(() => {
    getUser(endpointUser, "reload");
  }, []);
  useEffect(() => {
    if (project_id != 0) {
      getProduct(endpointProduct, "reload");
    }
  }, [project_id]);
  if (project_id == 0) {
    return (
      <div className="alert alert-warning">
        Vui lòng chọn phần mềm để xem danh sách sản phẩm.
      </div>
    );
  }

  const handlderClickActive = async (id_product: string) => {
    await putData("/product/status", { id: id_product, status: "active" });
    if (!errorUpdateStatus) getProduct(endpointProduct);
    else {
      alert("cập nhật trạng thái thất bại");
    }
  };

  if (errorData && !productList) {
    return (
      <div className="alert alert-error">
        <span>{errorData.message}</span>
      </div>
    );
  }

  const dataList = reshapeData(productList, userList);
  return (
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
                <td>
                  {item.status == "active" ? (
                    <span className="badge badge-info">Đang hoạt động</span>
                  ) : (
                    <span className="badge badge-outline badge-secondary">
                      Nháp
                    </span>
                  )}
                </td>
                <td className="flex gap-1">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      openEditDialog({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        create_by: 0,
                        createdAt: "",
                        status: item.status,
                      })
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {item.status != "active" && (
                    <div
                      className="tooltip"
                      data-tip="Chuyển trạng thái hoạt động"
                    >
                      <button
                        className="btn btn-outline btn-sm btn-secondary"
                        onClick={() => handlderClickActive(item.id)}
                        disabled={activeLoading}
                      >
                        <Activity />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isEditDialogOpen && selectedProduct && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setEditDialogOpen(false)}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Chỉnh sửa sản phẩm</h3>

            <form
              className="flex flex-col gap-3 mt-4 items-center"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (
                  form.elements.namedItem("name") as HTMLInputElement
                ).value;
                const description = (
                  form.elements.namedItem("description") as HTMLInputElement
                ).value;

                const updateEndpoint = "/product";
                const updateBody = {
                  id: selectedProduct.id,
                  name,
                  description,
                };

                const res = await updateData<ProductDto, typeof updateBody>({
                  endpoint: updateEndpoint,
                  data: updateBody,
                });

                if (res.code === 200) {
                  await getProduct(endpointProduct); // reload danh sách
                  setEditDialogOpen(false);
                } else {
                  alert("Cập nhật thất bại: " + res.message);
                }
              }}
            >
              <label className="input">
                <span className="label">Tên sản phẩm</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className=""
                  defaultValue={selectedProduct.name}
                  required
                />
              </label>

              <label className="input">
                <span className="label">Mô tả</span>
                <input
                  id="description"
                  name="description"
                  defaultValue={selectedProduct.description}
                  required
                />
              </label>

              <div className="modal-action flex justify-between w-full">
                <button type="submit" className="btn btn-primary">
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={async () => {
                    const deleteEndpoint = `/product/${encodeBase64({
                      id: selectedProduct.id,
                    })}`;
                    const res = await deleteData<ProductDto>({
                      endpoint: deleteEndpoint,
                    });

                    if (res.code === 200) {
                      await getProduct(endpointProduct); // reload danh sách... Còn chưa fix
                      setEditDialogOpen(false);
                    } else {
                      alert("Xóa thất bại: " + res.message);
                    }
                  }}
                >
                  Xóa sản phẩm
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default ProductTable;
