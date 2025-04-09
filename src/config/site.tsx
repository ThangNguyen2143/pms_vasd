import {
  FolderKanban,
  Gauge,
  ListCheck,
  type LucideIcon,
  Projector,
  Users,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "PMS VASD",
  description: "website quản lý tiến độ dự án",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Trang chủ",
    href: "/",
  },
  {
    icon: FolderKanban,
    name: "Phần mềm",
    href: "/products",
  },
  {
    icon: Projector,
    name: "Dự án",
    href: "/projects",
  },
  {
    icon: ListCheck,
    name: "Công việc",
    href: "/tasks",
  },
  {
    icon: Users,
    name: "Quản lý",
    href: "/employees",
  },
];
