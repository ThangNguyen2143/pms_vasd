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
  description: "Làm thử website quản lý nhân viên",
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
    href: "/task",
  },
  {
    icon: Users,
    name: "Quản lý",
    href: "/employees",
  },
];
