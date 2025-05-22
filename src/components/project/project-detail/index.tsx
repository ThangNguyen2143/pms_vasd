"use client";
import { FolderGit2, Info, SquareChartGantt } from "lucide-react";
import { useState } from "react";
import ProjectBase from "./project-base";
import MainProductTable from "~/components/product/main-product-table";
import clsx from "clsx";

function MainDisplayOnProject({ project_id }: { project_id: number }) {
  const [display, setDisplay] = useState<string>("baseinfo");
  return (
    <div className="container">
      {display == "baseinfo" && <ProjectBase project_id={project_id} />}
      {display == "product" && <MainProductTable project_id={project_id} />}
      <div className="dock dock-md">
        <button
          className={clsx(display == "baseinfo" ? "dock-active" : "")}
          onClick={() => setDisplay("baseinfo")}
        >
          <Info className="size-[1.2em]" />
          <span className="dock-label">Thông tin</span>
        </button>

        <button
          className={clsx(display == "product" ? "dock-active" : "")}
          onClick={() => setDisplay("product")}
        >
          <FolderGit2 className={"size-[1.2em]"} />
          <span className="dock-label">Phần mềm</span>
        </button>

        <button>
          <SquareChartGantt className="size-[1.2em]" />
          <span className="dock-label">Tiến độ</span>
        </button>
      </div>
    </div>
  );
}
export default MainDisplayOnProject;
