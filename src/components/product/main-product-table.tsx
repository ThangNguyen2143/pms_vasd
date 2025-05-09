"use client";

import { useEffect, useState } from "react";
import LitsProject from "./product-list-select";
import AddProductBtn from "./add-product";
import ProductTable from "./product-table";

function MainProductTable() {
  const [projectId, setprojectId] = useState(0);
  // Lấy projectSelected từ localStorage khi component mount
  useEffect(() => {
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setprojectId(parseInt(saved));
  }, []);
  // Lưu mỗi khi projectSelected thay đổi
  useEffect(() => {
    if (projectId !== 0) {
      sessionStorage.setItem("projectSelected", projectId.toString());
    }
  }, [projectId]);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end gap-2">
        <LitsProject project_id={projectId} setProjectId={setprojectId} />
        <AddProductBtn project_id={projectId} />
      </div>
      <ProductTable project_id={projectId} />
    </div>
  );
}

export default MainProductTable;
