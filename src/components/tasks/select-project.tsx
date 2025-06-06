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
  // const endpointProject = "/project/" + encodeBase64({ type: "all" });
  // const { data: dataProject, getData, errorData } = useApi<ProjectDto[]>();
  // const { getData: getProductList } = useApi<ProductDto[]>();
  // const [listSelect, setListSelect] = useState<ProductAndProject[]>([]);

  // Lấy lại lựa chọn từ localStorage
  useEffect(() => {
    const storedId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedId) {
      setProductSelect(storedId);
    }
  }, []);

  // Lấy dữ liệu project
  // useEffect(() => {
  //   if (!dataProject && !errorData) getData(endpointProject, "reload");
  // }, []);

  // Lấy danh sách sản phẩm theo từng project
  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     if (dataProject) {
  //       const promises = dataProject.map(async (project) => {
  //         const endpointProduct =
  //           "/product/" + encodeBase64({ type: "all", project_id: project.id });
  //         try {
  //           const products = await getProductList(endpointProduct, "reload");
  //           const activeProducts = products?.filter(
  //             (p) => p.status === "active"
  //           );
  //           return {
  //             ...project,
  //             product: activeProducts?.length ? activeProducts : undefined,
  //           };
  //         } catch {
  //           return {
  //             ...project,
  //             product: undefined,
  //           };
  //         }
  //       });

  //       const results = await Promise.all(promises);
  //       setListSelect(results);
  //     }
  //   };

  //   fetchAllProducts();
  // }, [dataProject]);

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
  const displayLabel = !nameProject ? (
    <span className="loading loading-spinner loading-sm"></span>
  ) : (
    nameProject + " của " + nameProduct
  );

  if (!dataProject) {
    return (
      <div className="alert alert-info">
        Đang tải
        <span className="loading loading-dots loading-sm"></span>
      </div>
    );
  }
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
}

export default SelectProject;
