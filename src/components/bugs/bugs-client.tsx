"use client";
import { useState } from "react";
import SelectProject from "../tasks/select-project";
import AddBugModal from "./modal/add-bug-modal";
import BugList from "./bug-list";

function BugsClient() {
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
          Báo bug
        </button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <label className="input">
            <span className="label">Tìm kiếm</span>
            <input type="text" placeholder="Nhập ID, tiêu đề tìm kiếm" />
          </label>
        </div>
        <form className="filter">
          <input className="btn btn-square" type="reset" value="×" />
          <input
            className="btn"
            type="radio"
            name="frameworks"
            aria-label="New"
          />
          <input
            className="btn"
            type="radio"
            name="frameworks"
            aria-label="Open"
          />
          <input
            className="btn"
            type="radio"
            name="frameworks"
            aria-label="Resolved"
          />
          <input
            className="btn"
            type="radio"
            name="frameworks"
            aria-label="Rejected"
          />
        </form>
      </div>
      <BugList product_id={selectProduct} key={refreshKey} />

      {showModal && (
        <AddBugModal
          product_id={selectProduct}
          onClose={() => setShowModal(false)}
          onCreated={() => setRefreshKey((prev) => prev + 1)}
        />
      )}
    </div>
  );
}

export default BugsClient;
