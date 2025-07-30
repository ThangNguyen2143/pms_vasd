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
import SelectInput from "../ui/selectOptions";
import DateTimeRangePick from "../ui/date-time-range";
import { endOfDay, parse, startOfDay } from "date-fns";

function BugsClient() {
  const [selectProduct, setSelectProduct] = useState<string>("");
  const [timeRangeFillter, settimeRangeFillter] = useState("");
  const [showUpdateInProduct, setShowUpdateInProduct] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [findBug, setFindBug] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
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
      const filteredBugs = bugs
        .filter((bug) => {
          return findBug.trim().length > 0
            ? bug.bug_id === parseInt(findBug) ||
                bug.name.toLowerCase().includes(findBug.toLowerCase())
            : true;
        })
        .filter((bug) => {
          if (timeRangeFillter != "") {
            const rangeDate = timeRangeFillter
              .split(" đến ")
              .map((d) => parse(d, "dd/MM/yyyy", new Date()));
            const fromDate = startOfDay(new Date(rangeDate[0])).getTime();
            const toDate = endOfDay(new Date(rangeDate[1])).getTime();
            const bugCreate = new Date(bug.date_create).getTime();
            return bugCreate > fromDate && bugCreate < toDate;
          } else {
            return true;
          }
        })
        .filter((bug) => {
          if (filterStatus.length > 0) {
            const bugHasStatus = filterStatus.includes(bug.status);
            return bugHasStatus;
          } else {
            const bugNoClosed = bug.status != "CLOSED";
            const bugNoUpdate = bug.is_update == false;
            return bugNoClosed || bugNoUpdate;
          }
        });
      setBugList(filteredBugs);
    }
  }, [filterStatus, findBug, bugs, timeRangeFillter]);

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
      <div className="grid grid-cols-3 gap-4">
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
        <div className="flex gap-2 justify-center">
          <DateTimeRangePick
            value={timeRangeFillter}
            onChange={settimeRangeFillter}
            className="w-fit"
          />
          {timeRangeFillter != "" && (
            <button
              className="btn tooltip btn-ghost tooltip-right"
              data-tip="Bỏ chọn"
              onClick={() => settimeRangeFillter("")}
            >
              X
            </button>
          )}
        </div>

        <div className="flex items-center justify-end">
          <div>
            <SelectInput
              placeholder="Chọn trạng thái"
              setValue={(selected) =>
                setFilterStatus(
                  Array.isArray(selected) ? selected.map((s) => s) : []
                )
              }
              options={
                bugStatus?.map((st) => ({ value: st.code, label: st.code })) ??
                []
              }
              isMulti
            />
          </div>
        </div>
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
          onCreated={async () => {
            await getBugList(endpoint(selectProduct), "reload");
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
