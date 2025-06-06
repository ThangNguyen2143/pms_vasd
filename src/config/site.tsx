import {
  Bug,
  ChartLine,
  FolderSearch,
  ListCheck,
  type LucideIcon,
  NotebookPen,
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
    icon: ChartLine,
    name: "Theo dõi tiến độ",
    href: "/work_share",
  },
  {
    icon: NotebookPen,
    name: "Ghi nhận yêu cầu",
    href: "/requirements",
  },
  {
    icon: FolderSearch,
    name: "Test case",
    href: "/testcase",
  },
  {
    icon: Bug,
    name: "Bugs",
    href: "/bugs",
  },
  {
    icon: Users,
    name: "Quản lý",
    href: "/employees",
  },
];
