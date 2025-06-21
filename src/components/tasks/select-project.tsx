/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
// import { useApi } from "~/hooks/use-api";
// import { encodeBase64 } from "~/lib/services";
// import { ProductDto, ProjectDto } from "~/lib/types";
import { useProject } from "~/providers/project-context";

const LOCAL_STORAGE_KEY = "selectedProductId";

function SelectProject({
  productSelected,
  setProductSelect,
}: {
  productSelected: string;
  setProductSelect: (product_id: string) => void;
}) {
  const projectContext = useProject();
  const dataProject = projectContext?.projects;
  // Lấy lại lựa chọn từ localStorage
  useEffect(() => {
    const storedId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedId) {
      setProductSelect(storedId);
    }
  }, []);
  // Lưu vào localStorage khi người dùng chọn sản phẩm
  const handleClickProduct = (product_id: string) => {
    setProductSelect(product_id);
    localStorage.setItem(LOCAL_STORAGE_KEY, product_id);
  };

  const findProject = (product_id: string) => {
    const projectInList = dataProject?.find((project) => {
      if (project.products)
        return project.products.some((product) => product.id === product_id);
      return undefined;
    });
    if (projectInList) {
      return {
        product: projectInList.products,
        ...dataProject?.find((project) => projectInList.id === project.id),
      };
    }
    return undefined;
  };
  const nameProduct = findProject(productSelected)?.name;
  const nameProject = findProject(productSelected)?.product?.find(
    (p) => p.id === productSelected
  )?.name;
  const displayLabel = !nameProject
    ? projectContext?.isLoading && (
        <span className="loading loading-spinner loading-sm"></span>
      )
    : nameProject + " của " + nameProduct;

  if (projectContext?.isLoading) {
    return (
      <div className="alert alert-info">
        Đang tải
        <span className="loading loading-dots loading-sm"></span>
      </div>
    );
  }
  if (dataProject)
    return (
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          {productSelected === "" ? "Chọn phần mềm" : displayLabel}
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-base-100 rounded-box z-10 p-2 shadow-sm"
        >
          {dataProject.map((project) => (
            <li key={project.id}>
              <h2 className="menu-title">{project.name}</h2>
              {project.products ? (
                <ul>
                  {project.products.map((product) => (
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
  else {
    return (
      <div className="m-2">
        <div className="alert alert-info">Không có dữ liệu</div>
      </div>
    );
  }
}

export default SelectProject;
