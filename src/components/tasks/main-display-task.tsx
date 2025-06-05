"use client";
import { useState } from "react";
import SelectProject from "./select-project";
import TaskList from "./task-list";
import CreateTaskForm from "./create-task-form";
import clsx from "clsx";

function MainDisplayTask() {
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
          Thêm task
        </button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <label className="input">
            <span className="label">Tìm kiếm</span>
            <input type="text" placeholder="Nhập tên việc" />
          </label>
        </div>
        <div>
          <label className="select">
            <span className="label">Trạng thái</span>
            <select>
              <option>Đang hoạt động</option>
              <option>Đang khóa</option>
            </select>
          </label>
        </div>
      </div>
      <TaskList product_id={selectProduct} key={refreshKey} />

      <dialog
        className={clsx(
          "modal",
          showModal && selectProduct != "" ? "modal-open" : ""
        )}
      >
        <div className="modal-box max-w-5xl w-full">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <h3 className="text-lg">Thêm task</h3>
          <CreateTaskForm
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

export default MainDisplayTask;
