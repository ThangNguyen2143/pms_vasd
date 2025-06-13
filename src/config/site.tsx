import {
  Bug,
  ChartLine,
  ChartPie,
  FolderSearch,
  Globe,
  ListCheck,
  type LucideIcon,
  MessageSquareWarning,
  NotebookPen,
  Projector,
  Settings,
  Users,
} from "lucide-react";
import { MenuNav } from "~/lib/types";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "PMS VASD",
  description: "website quản lý dự án thuộc công ty VASD",
};
export const setNavigation = (menu: MenuNav[]) => {
  return menu
    .map((item) => {
      let icon: LucideIcon;
      switch (item.code) {
        case "project":
          icon = Projector;
          break;
        case "task":
          icon = ListCheck;
          break;
        case "work_share":
          icon = ChartLine;
          break;
        case "requirement":
          icon = NotebookPen;
          break;
        case "test_case":
          icon = FolderSearch;
          break;
        case "bug":
          icon = Bug;
          break;
        case "user_manage":
          icon = Users;
          break;
        case "settings":
          icon = Settings;
          break;
        case "statistical":
          icon = ChartPie;
          break;
        case "incident_report":
          icon = MessageSquareWarning;
          break;
        default:
          icon = Globe; // Default icon if no match
      }
      if (item.code === "home" || item.code === "profile") {
        return undefined; // Skip home and profile items
      }
      return {
        icon,
        name: item.display,
        href: "/" + item.code,
      };
    })
    .filter((nav): nav is Navigation => nav !== undefined);
};
