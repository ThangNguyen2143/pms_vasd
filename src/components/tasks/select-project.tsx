/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductDto, ProjectDto } from "~/lib/types";
interface ProductAndProject extends ProjectDto {
  product?: ProductDto[];
}
const LOCAL_STORAGE_KEY = "selectedProductId";

function SelectProject({
  productSelected,
  setProductSelect,
}: {
  productSelected: string;
  setProductSelect: (product_id: string) => void;
}) {
  const endpointProject = "/project/" + encodeBase64({ type: "all" });
  const { data: dataProject, getData, errorData } = useApi<ProjectDto[]>();
  const { getData: getProductList } = useApi<ProductDto[]>();
  const [listSelect, setListSelect] = useState<ProductAndProject[]>([]);

  // Lấy lại lựa chọn từ localStorage
  useEffect(() => {
    const storedId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedId) {
      setProductSelect(storedId);
    }
  }, []);

  // Lấy dữ liệu project
  useEffect(() => {
    if (!dataProject && !errorData) getData(endpointProject, "reload");
  }, []);

  // Lấy danh sách sản phẩm theo từng project
  useEffect(() => {
    const fetchAllProducts = async () => {
      if (dataProject) {
        const promises = dataProject.map(async (project) => {
          const endpointProduct =
            "/product/" + encodeBase64({ type: "all", project_id: project.id });
          try {
            const products = await getProductList(endpointProduct, "reload");
            const activeProducts = products?.filter(
              (p) => p.status === "active"
            );
            return {
              ...project,
              product: activeProducts?.length ? activeProducts : undefined,
            };
          } catch {
            return {
              ...project,
              product: undefined,
            };
          }
        });

        const results = await Promise.all(promises);
        setListSelect(results);
      }
    };

    fetchAllProducts();
  }, [dataProject]);

  // Lưu vào localStorage khi người dùng chọn sản phẩm
  const handleClickProduct = (product_id: string) => {
    setProductSelect(product_id);
    localStorage.setItem(LOCAL_STORAGE_KEY, product_id);
  };

  const findProject = (product_id: string) => {
    const projectInList = listSelect.find((t) =>
      t.product?.some((p) => p.id === product_id)
    );
    if (projectInList) {
      return {
        product: projectInList.product,
        ...dataProject?.find((project) => projectInList.id === project.id),
      };
    }
    return undefined;
  };
  const nameProduct = findProject(productSelected)?.name;
  const nameProject = findProject(productSelected)?.product?.find(
    (p) => p.id === productSelected
  )?.name;
  const displayLabel = !nameProject ? (
    <span className="loading loading-spinner loading-sm"></span>
  ) : (
    nameProject + " của " + nameProduct
  );

  if (!dataProject) {
    if (errorData) {
      if (errorData.code === 401)
        return <div className="alert alert-warning">Bạn chưa đăng nhập</div>;
      if (errorData.code === 403)
        return (
          <div className="alert alert-warning">Bạn không có quyền truy cập</div>
        );
      if (errorData.code === 404)
        return <div className="alert alert-error">Không tìm thấy dữ liệu</div>;
      if (errorData.code === 500)
        return (
          <div className="alert alert-error">
            Lỗi máy chủ, vui lòng thử lại sau
          </div>
        );
      return <div className="alert alert-error">{errorData?.message}</div>;
    }
    return (
      <div className="alert alert-info">
        Đang tải
        <span className="loading loading-dots loading-sm"></span>
      </div>
    );
  }
  if (errorData?.code !== 200 && !dataProject)
    return <div className="alert alert-error">{errorData?.message}</div>;

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        {productSelected === "" ? "Chọn phần mềm" : displayLabel}
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-10 p-2 shadow-sm"
      >
        {listSelect.map((project) => (
          <li key={project.id}>
            <h2 className="menu-title">{project.name}</h2>
            {project.product ? (
              <ul>
                {project.product.map((product) => (
                  <li key={product.id}>
                    <a
                      id={product.id}
                      className="hover:cursor-pointer"
                      onClick={() => handleClickProduct(product.id)}
                    >
                      {product.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span>Chưa có phần mềm nào</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectProject;
