/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductDto, UserDto } from "~/lib/types";
import { Activity, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateInfoProductModal from "./update-info-product-modal";

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
    if (errorUpdateStatus) toast.error(errorUpdateStatus.message);
  }, [errorUpdateStatus]);
  useEffect(() => {
    if (project_id != 0) {
      getProduct(endpointProduct, "reload");
    }
  }, [project_id]);
  const onUpdate = async () => {
    if (selectedProduct) {
      await getProduct(endpointProduct, "reload");
      setEditDialogOpen(false);
      setSelectedProduct(undefined);
    }
  };
  if (project_id == 0) {
    return (
      <div className="alert alert-warning">
        Vui lòng chọn phần mềm để xem danh sách sản phẩm.
      </div>
    );
  }

  const handlderClickActive = async (id_product: string) => {
    const re = await putData("/product/status", {
      id: id_product,
      status: "active",
    });
    if (re == "") {
      toast.success("Cập nhật trạng thái thành công");
      // Reload danh sách sản phẩm sau khi cập nhật
      await getProduct(endpointProduct, "reload");
      // Cập nhật trạng thái của sản phẩm trong danh sách hiện tại
      const updatedProduct = productList?.find(
        (product) => product.id === id_product
      );
      if (updatedProduct) {
        updatedProduct.status = "active";
      }
    } else {
      return;
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
                    className="btn btn-sm btn-outline btn-primary"
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
        <UpdateInfoProductModal
          onClose={() => setEditDialogOpen(false)}
          onUpdate={onUpdate}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default ProductTable;
