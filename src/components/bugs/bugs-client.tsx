/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import SelectProject from "../tasks/select-project";
import AddBugModal from "./modal/add-bug-modal";
import BugList from "./bug-list";
import { encodeBase64 } from "~/lib/services";
import { useApi } from "~/hooks/use-api";
import { BugDto, BugStatus } from "~/lib/types";
import UpdateBugInProductModalConfirm from "./modal/update-bug-in-product-modal";

function BugsClient() {
  const [selectProduct, setSelectProduct] = useState<string>("");
  const [showUpdateInProduct, setShowUpdateInProduct] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [findBug, setFindBug] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const endpoint = (product_id: string) =>
    "/bugs/" + encodeBase64({ product_id });
  const [bugList, setBugList] = useState([] as BugDto[]);
  const { data: bugStatus, getData: getBugStatus } = useApi<BugStatus[]>();
  const {
    data: bugs,
    getData: getBugList,
    isLoading,
    errorData,
  } = useApi<BugDto[]>();
  useEffect(() => {
    getBugStatus("/system/config/eyJ0eXBlIjoiYnVnX3N0YXR1cyJ9", "default");
  }, []);
  useEffect(() => {
    if (selectProduct != "") getBugList(endpoint(selectProduct), "reload");
  }, [selectProduct]);
  useEffect(() => {
    if (bugs) {
      setBugList(bugs);
    } else setBugList([]);
  }, [bugs]);
  useEffect(() => {
    if (bugs) {
      const filteredBugs = bugs
        .filter((bug) => (filterStatus ? bug.status === filterStatus : true))
        .filter((bug) => {
          return findBug
            ? bug.bug_id === parseInt(findBug) ||
                bug.name.toLowerCase().includes(findBug.toLowerCase())
            : true;
        });
      setBugList(filteredBugs);
    }
  }, [filterStatus, findBug, bugs]);
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
            <input
              type="text"
              placeholder="Nhập ID, tiêu đề tìm kiếm"
              value={findBug}
              onChange={(e) => setFindBug(e.target.value)}
            />
          </label>
        </div>
        <form className="filter">
          <input
            className="btn btn-square"
            type="reset"
            value="×"
            onClick={() => setFilterStatus("")}
          />

          {bugStatus &&
            bugStatus.length > 0 &&
            bugStatus.map((status) => (
              <input
                className="btn"
                key={status.code}
                type="radio"
                name="frameworks"
                aria-label={status.code}
                value={status.code}
                checked={filterStatus === status.code}
                onChange={() => setFilterStatus(status.code)}
              />
            ))}
        </form>
      </div>

      {isLoading ? (
        <div className="flex text-center justify-center">
          <span className="loading loading-infinity loading-xl" />
        </div>
      ) : errorData && errorData.code != 404 ? (
        <div className="alert alert-error justify-center">
          {errorData.message}
        </div>
      ) : (
        <BugList
          product_id={selectProduct}
          bugList={bugList}
          onUpdateInProduct={(id) => setShowUpdateInProduct(id)}
        />
      )}

      {showModal && (
        <AddBugModal
          product_id={selectProduct}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            getBugList(endpoint(selectProduct), "reload");
          }}
        />
      )}
      {showUpdateInProduct.length > 0 && (
        <UpdateBugInProductModalConfirm
          onUpdate={async () => {
            await getBugList(endpoint(selectProduct), "reload");
          }}
          list={showUpdateInProduct}
          bugList={bugList}
          onClose={() => setShowUpdateInProduct([])}
        />
      )}
    </div>
  );
}

export default BugsClient;
