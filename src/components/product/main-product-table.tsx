/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ProductDto, UserDto } from "~/lib/types";
import AddProductBtn from "./add-product";
import ProductTable from "./product-table";
import { useApi } from "~/hooks/use-api";
import { useEffect, useState } from "react";
import { encodeBase64 } from "~/lib/services";
import UpdateInfoProductModal from "./update-info-product-modal";
import ProductModuleModal from "./product-detail-modal";
import DetailFunctionModule from "./detail-function-module";

function MainProductTable({ project_id }: { project_id: number }) {
  const {
    data: productList,
    getData: getProduct,
    isLoading,
    errorData,
  } = useApi<ProductDto[]>();
  const { data: userList, getData: getUser } = useApi<UserDto[]>();
  const [showFuncInModule, setShowFuncInModule] = useState<string>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto>();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [showModuleDetail, setShowModuleDetail] = useState<string>("");
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  const openEditDialog = (product_id: string) => {
    const product = productList?.find((pro) => pro.id == product_id);
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
        Vui lòng chọn dự án để xem danh sách phần mềm.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto mt-6">
      <div className="flex justify-between gap-2">
        <h2 className="text-2xl font-bold">Danh sách phần mềm</h2>
        {/* <LitsProject project_id={projectId} setProjectId={setprojectId} /> */}
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Thêm phần mềm
        </button>
        {showAddModal && (
          <AddProductBtn
            project_id={project_id}
            onClose={() => setShowAddModal(false)}
            onUpdate={async () => {
              await getProduct(endpointProduct, "reload");
            }}
          />
        )}
      </div>
      {isLoading ? (
        <span className="loading loading-infinity" />
      ) : errorData && errorData.code != 404 ? (
        <div>
          <div className="alert alert-error">{errorData.message}</div>
        </div>
      ) : (
        <ProductTable
          onUpdate={async () => {
            await getUser(endpointUser, "reload");
          }}
          openEditDialog={(id) => openEditDialog(id)}
          productList={productList || []}
          setShowModuleDetail={(id) => setShowModuleDetail(id)}
          userList={userList || []}
        />
      )}
      {isEditDialogOpen && selectedProduct && (
        <UpdateInfoProductModal
          onClose={() => setEditDialogOpen(false)}
          onUpdate={onUpdate}
          product={selectedProduct}
        />
      )}
      <div className="drawer drawer-end z-50 w-24">
        <input
          id={`detail-module-drawer`}
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-side">
          <label
            htmlFor={`detail-module-drawer`}
            className="drawer-overlay"
            onClick={() => setShowModuleDetail("")}
          />
          <ProductModuleModal
            onClose={() => {
              document.getElementById("detail-module-drawer")?.click();
              setShowModuleDetail("");
            }}
            onOpenFunc={(id: string) => setShowFuncInModule(id)}
            product_id={showModuleDetail}
          />
        </div>
      </div>
      {showFuncInModule && (
        <DetailFunctionModule
          module_id={showFuncInModule}
          onClose={() => setShowFuncInModule(undefined)}
          product_id={showModuleDetail}
        />
      )}
    </div>
  );
}

export default MainProductTable;
