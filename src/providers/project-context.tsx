"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { fetchData } from "~/lib/api-client";
import { encodeBase64 } from "~/lib/services";
import { ProductDto, ProjectDto } from "~/lib/types";

type Project = {
  id: number;
  name: string;
  products?: {
    id: string;
    name: string;
  }[];
};
type Product = {
  id: string;
  name: string;
};
type ProjectContextType = {
  projects: Project[] | null;
  isLoading: boolean;
  products: Product[] | null;
  setProject: (projects: Project[] | null) => void;
  setProduct: (
    products: { id: string; name: string }[],
    project_id: number
  ) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProject] = useState<Project[] | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [products, setProduct] = useState<Product[] | null>(null);
  // const setProduct = useCallback(
  //   (products: { id: string; name: string }[], project_id: number) => {
  //     setProject((prevProjects) => {
  //       if (!prevProjects) return null;
  //       return prevProjects.map((project) =>
  //         project.id === project_id
  //           ? { ...project, products: products }
  //           : project
  //       );
  //     });
  //   },
  //   [setProject]
  // );

  useEffect(() => {
    const fetchProjects = async () => {
      //Hàm lấy danh sách dự án đang tham gia
      const response = await fetchData<ProjectDto[]>({
        endpoint: "/system/config/" + encodeBase64({ type: "project" }),
        cache: "default",
      });
      if (!response.value) return;
      setProject(response.value);
      // response.value.map((project) => {
      //   fetchSoftware(project.id);
      // });
    };
    const fetchSoftware = async () => {
      // Gọi API để lấy danh sách phần mềm
      const endpointProduct =
        "/system/config/" + encodeBase64({ type: "product" });
      const response = await fetchData<ProductDto[]>({
        endpoint: endpointProduct,
        cache: "default",
      });
      setProduct(response.value);
    };
    setLoading(true);
    fetchProjects();
    fetchSoftware();
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      projects,
      isLoading,
      setProject,
      products,
      setProduct,
    }),
    [projects, setProject, products, setProduct, isLoading]
  );
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  //Chưa biết thêm gì
  return context;
}
