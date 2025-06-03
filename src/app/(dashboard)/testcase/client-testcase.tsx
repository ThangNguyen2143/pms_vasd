"use client";

import clsx from "clsx";
import { useState } from "react";
import SelectProject from "~/components/tasks/select-project";
import CreateTestcaseForm from "~/components/testcase/modals/create-testcase-form";
import TestList from "~/components/testcase/test-list";

function ClientTestCasesPage() {
  const [selectProduct, setSelectProduct] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="flex flex-col w-full h-full align-middle gap-4">
      <div className="flex flex-row justify-between items-center">
        <SelectProject
          setProductSelect={setSelectProduct}
          productSelected={selectProduct}
        />
        <button className="btn btn-info" onClick={() => setShowModal(true)}>
          Thêm testcase
        </button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <label className="input">
            <span className="label">Tìm kiếm</span>
            <input type="text" placeholder="Nhập tiêu đề test" />
          </label>
        </div>
        <div>
          <label className="select">
            <span className="label">Trạng thái</span>
            <select>
              <option>Chờ thêm</option>
            </select>
          </label>
        </div>
      </div>
      <TestList product_id={selectProduct} key={refreshKey} />

      <dialog
        className={clsx(
          "modal",
          showModal && selectProduct != "" ? "modal-open" : ""
        )}
      >
        <div className="modal-box w-11/12 max-w-7xl max-h-11/12 h-full">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <h3 className="text-lg">Thêm task</h3>
          <CreateTestcaseForm
            product_id={selectProduct}
            onSuccess={() => {
              setRefreshKey((prev) => prev + 1);
              setShowModal(false);
            }} // trigger reload
          />
        </div>
      </dialog>
    </div>
  );
}

export default ClientTestCasesPage;
