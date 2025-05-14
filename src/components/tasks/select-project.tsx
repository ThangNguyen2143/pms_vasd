/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductDto, ProjectDto } from "~/lib/types";
interface ProductAndProject extends ProjectDto {
  product?: ProductDto[];
}
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
  useEffect(() => {
    if (!dataProject && !errorData) getData(endpointProject, "reload");
  }, []);
  useEffect(() => {
    if (dataProject)
      dataProject.forEach((project) => {
        const endpointProduct =
          "/product/" + encodeBase64({ type: "all", project_id: project.id });
        getProductList(endpointProduct, "reload")
          .then((products) => {
            if (products) {
              const productActive = products.filter(
                (product) => product.status == "active"
              );
              return productActive;
            }
          })
          .then((product) => {
            const productAndProject: ProductAndProject = {
              ...project,
              product: product ? product : undefined,
            };
            setListSelect([...listSelect, productAndProject]);
          })
          .catch((err) => <div className="badge badge-error">{err}</div>);
      });
  }, [dataProject]);
  if (!dataProject) return <div className="alert alert-info">Đang tải...</div>;
  if (errorData?.code !== 200 && !dataProject) {
    return <div className="alert alert-error">{errorData?.message}</div>;
  }
  const handleClickProduct = (product_id: string) => {
    setProductSelect(product_id);
  };
  const findProject = (product_id: string) => {
    const projectInList = listSelect.find((t) => {
      return t.product && t.product.find((p) => p.id == product_id)
        ? true
        : false;
    });
    if (projectInList)
      return {
        product: projectInList.product,
        ...dataProject.find((project) => {
          return projectInList.id == project.id;
        }),
      };
  };
  const displayLable =
    findProject(productSelected)?.product?.find((p) => p.id == productSelected)
      ?.name +
    " của " +
    findProject(productSelected)?.name;
  return (
    <div className="dropdown">
      <div tabIndex={0} role={"button"} className="btn m-1">
        {productSelected == "" ? "Chọn phần mềm" : displayLable}
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm"
      >
        {listSelect.map((project) => {
          return (
            <li key={project.id}>
              <h2 className="menu-title">{project.name}</h2>
              {project.product ? (
                <ul>
                  {project.product?.map((product) => (
                    <li key={product.id}>
                      <a
                        id={product.id}
                        className="hover:cursor-pointer"
                        onClick={(e) => handleClickProduct(e.currentTarget.id)}
                      >
                        {product.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span>Chưa có phần mềm nào được thêm</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SelectProject;
