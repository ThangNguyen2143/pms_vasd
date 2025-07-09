/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import ListProject from "./project-list-select";
import TableWork from "./table-work";
// import AddWorkBtn from "./add-work-btn";
import { encodeBase64 } from "~/lib/services";
import { useApi } from "~/hooks/use-api";
import {
  Priority,
  ProductDto,
  ProjectLocation,
  RequirementDto,
  RequirementStatus,
  RequirementType,
} from "~/lib/types";
// import { useUser } from "~/providers/user-context";
import OverviewWork from "./orverview-work";
import { format_date, toISOString } from "~/utils/fomat-date";
import { endOfDay, startOfDay, subDays } from "date-fns";
import DateTimePicker from "../ui/date-time-picker";
import AddRequirementModal from "../requirment/modals/add-requirement-modal";

function MainWork() {
  // const { user } = useUser();
  // const role = user?.role;
  const [projectSelected, setProjectSelect] = useState<number>(0);

  const [showAddRequirment, setShowAddRequirment] = useState(false);
  const { data: statusList, getData: getStatusList } =
    useApi<RequirementStatus[]>();
  const { data: priorityList, getData: getPriority } = useApi<Priority[]>();
  const { data: typeWorkList, getData: getTypeWork } =
    useApi<RequirementType[]>();
  const [fromDate, setFromDate] = useState<string>(
    format_date(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, settoDate] = useState<string>(
    format_date(endOfDay(new Date()))
  );
  const {
    data: workList,
    getData: getWorkList,
    errorData: errorWorkList,
    isLoading: loadingWork,
  } = useApi<RequirementDto[]>();
  const fetchData = async (from: string, to: string) => {
    const endpointWork =
      "/requirements/" +
      encodeBase64({ type: "project", project_id: projectSelected, from, to });
    await getWorkList(endpointWork);
  };
  const { data: productList, getData: getProducts } = useApi<ProductDto[]>();
  const { data: locations, getData: getLocations } =
    useApi<ProjectLocation[]>();
  useEffect(() => {
    // Lấy projectSelected từ localStorage khi component mount
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setProjectSelect(parseInt(saved));
    const fetchData = async () => {
      const endpointStatus =
        "/system/config/" + encodeBase64({ type: "requirement_status" });
      const endpointPriority =
        "/system/config/" + encodeBase64({ type: "priority" });
      const endpointTypeWork =
        "/system/config/" + encodeBase64({ type: "requirement_type" });

      await getStatusList(endpointStatus);
      await getPriority(endpointPriority);
      await getTypeWork(endpointTypeWork);
    };
    fetchData();
  }, []);
  // Lưu mỗi khi projectSelected thay đổi
  useEffect(() => {
    if (projectSelected !== 0) {
      sessionStorage.setItem("projectSelected", projectSelected.toString());
      const endpoint =
        "/product/" +
        encodeBase64({ type: "all", project_id: projectSelected });
      const endpointLocation =
        "/project/location/" + encodeBase64({ project_id: projectSelected });
      getLocations(endpointLocation, "reload");
      getProducts(endpoint, "reload");
    }
  }, [projectSelected]);
  useEffect(() => {
    if (projectSelected != 0) {
      fetchData(toISOString(fromDate), toISOString(toDate));
    }
  }, [projectSelected, fromDate, toDate]);
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="container flex justify-between items-center gap-4">
        <div className="flex gap-2 w-full">
          <ListProject
            projectSelected={projectSelected}
            setProjectSelect={setProjectSelect}
          />
          <div className="flex gap-2">
            <span className="label">Từ</span>
            <DateTimePicker
              value={fromDate}
              onChange={setFromDate}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <span className="label">Đến</span>
            <DateTimePicker
              value={toDate}
              onChange={settoDate}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-info"
            onClick={() => setShowAddRequirment(true)}
          >
            Thêm yêu cầu
          </button>
        </div>
      </div>
      {loadingWork ? (
        <span className="loading loading-infinity loading-lg"></span>
      ) : errorWorkList && errorWorkList.code != 404 ? (
        <div className="flex justify-center items-center h-screen">
          {errorWorkList.message}
        </div>
      ) : projectSelected != 0 ? (
        <div className="shadow-md sm:rounded-lg flex flex-col">
          <div className="tabs tabs-lift">
            <input
              type="radio"
              name="tab_swap"
              className="tab"
              defaultChecked
              id="overview"
              aria-label="Tổng quan"
            />
            <div className="tab-content">
              {priorityList && statusList && (
                <OverviewWork
                  priorityList={priorityList}
                  statusList={statusList}
                  dataRaw={workList}
                />
              )}
            </div>
            <input
              type="radio"
              name="tab_swap"
              id="detail"
              aria-label="Danh sách"
              className="tab"
            />
            <div className="tab-content">
              <TableWork
                workList={workList || []}
                priorityList={priorityList || undefined}
                statusList={statusList || undefined}
                typeList={typeWorkList || undefined}
                // isGuess={isGuess}
                // onUpdate={() => fetchData()}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          Chưa dự án nào được chọn
        </div>
      )}
      {showAddRequirment && (
        <AddRequirementModal
          product_list={productList || []}
          locationList={locations || []}
          onClose={() => setShowAddRequirment(false)}
          onCreated={async () => {
            await fetchData(fromDate, toDate);
          }}
        />
      )}
    </div>
  );
}

export default MainWork;
