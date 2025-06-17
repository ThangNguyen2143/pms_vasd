"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
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

type ProjectContextType = {
  projects: Project[] | null;
  setProject: (projects: Project[] | null) => void;
  setProduct: (
    products: { id: string; name: string }[],
    project_id: number
  ) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProject] = useState<Project[] | null>(null);
  const setProduct = useCallback(
    (products: { id: string; name: string }[], project_id: number) => {
      setProject((prevProjects) => {
        if (!prevProjects) return null;
        return prevProjects.map((project) =>
          project.id === project_id
            ? { ...project, products: products }
            : project
        );
      });
    },
    [setProject]
  );

  const fetchSoftware = async (project_id: number) => {
    // Gọi API để lấy danh sách phần mềm
    const endpointProduct =
      "/product/" + encodeBase64({ type: "all", project_id: project_id });
    const response = await fetchData<ProductDto[]>({
      endpoint: endpointProduct,
      cache: "default",
    });
    setProduct(response.value, project_id);
  };
  useEffect(() => {
    const fetchProjects = async () => {
      //Hàm lấy danh sách dự án đang tham gia
      const response = await fetchData<ProjectDto[]>({
        endpoint: "/system/config/" + encodeBase64({ type: "project" }),
        cache: "default",
      });
      if (!response.value) return;
      setProject(response.value);
      response.value.map((project) => {
        fetchSoftware(project.id);
      });
    };
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      projects,
      setProject,
      setProduct,
    }),
    [projects, setProject, setProduct]
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
