/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import ListProject from "./project-list-select";
import TableWork from "./table-work";
import AddWorkBtn from "./add-work-btn";
import { encodeBase64 } from "~/lib/services";
import { useApi } from "~/hooks/use-api";
import { Priority, WorkShareDto, WorkStatus, WorkType } from "~/lib/types";
import { useUser } from "~/providers/user-context";
import OverviewWork from "./orverview-work";

function MainWork() {
  const { user } = useUser();
  const role = user?.role;
  const [projectSelected, setProjectSelect] = useState<number>(0);
  const { data: statusList, getData: getStatusList } = useApi<WorkStatus[]>();
  const { data: priorityList, getData: getPriority } = useApi<Priority[]>();
  const { data: typeWorkList, getData: getTypeWork } = useApi<WorkType[]>();
  const {
    data: workList,
    getData: getWorkList,
    errorData: errorWorkList,
    isLoading: loadingWork,
  } = useApi<WorkShareDto[]>();
  const fetchData = async () => {
    const endpointWork =
      "/work/" + encodeBase64({ project_id: projectSelected });
    await getWorkList(endpointWork, "no-cache");
  };
  const isGuess = !role || role == "Guess";
  useEffect(() => {
    // Lấy projectSelected từ localStorage khi component mount
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setProjectSelect(parseInt(saved));
    const fetchData = async () => {
      const endpointStatus =
        "/system/config/" + encodeBase64({ type: "work_status" });
      const endpointPriority =
        "/system/config/" + encodeBase64({ type: "priority" });
      const endpointTypeWork =
        "/system/config/" + encodeBase64({ type: "work_type" });

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
    }
  }, [projectSelected]);

  useEffect(() => {
    if (projectSelected != 0) {
      const endpointWork =
        "/work/" + encodeBase64({ project_id: projectSelected });
      getWorkList(endpointWork, "reload");
    }
  }, [projectSelected]);
  if (!statusList || !priorityList || !typeWorkList) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4 items-center">
      <div className="container flex justify-between gap-2.5">
        <ListProject
          projectSelected={projectSelected}
          setProjectSelect={setProjectSelect}
        />
        {isGuess ? (
          ""
        ) : (
          <AddWorkBtn
            project_id={projectSelected.toString()}
            priority={priorityList}
            typeWork={typeWorkList}
            onSuccess={fetchData}
          />
        )}
      </div>
      {loadingWork ? (
        <span className="loading loading-infinity loading-lg"></span>
      ) : errorWorkList && errorWorkList.code != 404 ? (
        <div className="flex justify-center items-center h-screen">
          {errorWorkList.message}
        </div>
      ) : projectSelected != 0 ? (
        <div className="relative shadow-md sm:rounded-lg">
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
              <OverviewWork
                priorityList={priorityList}
                statusList={statusList}
                dataRaw={workList}
              />
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
                priorityList={priorityList}
                statusList={statusList}
                isGuess={isGuess}
                onUpdate={() => fetchData()}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          Chưa dự án nào được chọn
        </div>
      )}
    </div>
  );
}

export default MainWork;
