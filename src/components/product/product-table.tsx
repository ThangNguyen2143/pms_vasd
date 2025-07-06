"use client";
import { ProductDto, UserDto } from "~/lib/types";
import { Activity, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { useEffect } from "react";

interface ProductTableProps {
  productList: ProductDto[];
  userList: UserDto[];
  setShowModuleDetail: (id: string) => void;
  openEditDialog: (id: string) => void;
  onUpdate: () => Promise<void>;
}
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

function ProductTable({
  productList,
  userList,
  setShowModuleDetail,
  onUpdate,
  openEditDialog,
}: ProductTableProps) {
  const {
    putData,
    errorData: errorUpdateStatus,
    isLoading: activeLoading,
  } = useApi<"", { id: string; status: string }>();
  useEffect(() => {
    if (errorUpdateStatus) toast.error(errorUpdateStatus.message);
  }, [errorUpdateStatus]);
  const handlderClickActive = async (id_product: string) => {
    const re = await putData("/product/status", {
      id: id_product,
      status: "active",
    });
    if (re == "") {
      toast.success("Cập nhật trạng thái thành công");
      // Reload danh sách phần mềm sau khi cập nhật
      await onUpdate();
      // Cập nhật trạng thái của phần mềm trong danh sách hiện tại
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
  const dataList = reshapeData(productList, userList);
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên phần mềm</th>
            <th>Mô tả</th>
            <th>Người tạo</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataList.length > 0 ? (
            dataList.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td className="max-w-[600px] text-sm">{item.description}</td>
                  <td className="min-w-52">{item.createdBy}</td>
                  <td>
                    {item.status == "active" ? (
                      <span className="badge badge-info badge-lg truncate max-w-24">
                        {item.status}
                      </span>
                    ) : (
                      <div>
                        <span className="badge badge-outline badge-secondary">
                          {" "}
                          Nháp
                        </span>{" "}
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
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1 justify-center items-center">
                      <button
                        className="btn btn-sm btn-outline btn-primary tooltip"
                        data-tip="Cập nhật phần mềm"
                        onClick={() => openEditDialog(item.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <label
                        htmlFor={`detail-module-drawer`}
                        className="btn btn-outline btn-soft"
                        onClick={() => {
                          setShowModuleDetail(item.id);
                        }}
                      >
                        Module
                      </label>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="alert alert-info w-full">
                Chưa thêm phần mềm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
